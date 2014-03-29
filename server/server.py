from geventwebsocket import WebSocketServer, WebSocketApplication, Resource
from Queue import Queue, Empty
import msgpack
import time
import util
import threading
import signal
import sys

class PlayerSocket(WebSocketApplication):
    def __init__(self, ws):
        WebSocketApplication.__init__(self, ws)
        self.unpacker = msgpack.Unpacker()
        self.packer = msgpack.Packer()

    def on_open(self):
        print "Connection opened!"
        self.ws.handler.server.NewConnection(self)

    def on_message(self, message):
        try:
            self.unpacker.feed(message)
        except:
            pass # getting weird None-messages for some reason which cause exceptions
        for unpacked in self.unpacker:
#            print "Unpacekd message : " + str(unpacked)
            self.ws.handler.server.HandleMessage(unpacked, self)

    def on_close(self, reason):
        print "Connection closed : " + str(reason)
        self.ws.handler.server.CloseConnection(self)
        

class Server(WebSocketServer):
    def __init__(self, game):
        WebSocketServer.__init__(self, ('', 8000), Resource({'/': PlayerSocket}))
        self.players = {}
        self.nextid = 0
        self.packer = msgpack.Packer()
        self.unpacker = msgpack.Unpacker()
        self.game = game

    def HandleMessage(self, message, sender):
        if message['type'] == 'chat':
            self.HandleChatMessage(message['message'], sender.playername)
        else:
            message['player'] = sender
            self.game.inmessages.put(message)

    def HandleChatMessage(self, message, sender):
        self.BroadCastMessage({'type': 'chat', 'message': message, 'sender': sender})

    def NewConnection(self, client):
        client.playerid = self.nextid
        client.playername = 'Jorma'
        self.players[self.nextid] = client
        self.nextid += 1
        self.game.inmessages.put({'type': 'connect', 'player': client})
        self.BroadCastMessage({'type': 'chat', 'message': client.playername + ' connected.'})

    def CloseConnection(self, client):
        del self.players[client.playerid]
        self.game.inmessages.put({'type': 'disconnect', 'player': client})
        self.BroadCastMessage({'type': 'chat', 'message': client.playername + ' disconnected.'})

    def BroadCastMessage(self, message):
        msg = self.packer.pack(message)
#        print "Packed: " + str(msg)
        disconnectedplayers = []
        for p in self.players:
            try:
                self.players[p].ws.send(msg, True)
            except:
                disconnectedplayers.append(p)
        for p in disconnectedplayers:
            self.CloseConnection(self.players[p])

class Entity:
    def __init__(self, eid, game, model):
        self.entityid = eid
        self.x = 0
        self.y = 0
        self.xdir = 0
        self.ydir = 0
        self.moveCooldown = 0.0
        self.game = game
        self.model = model

    def tick(self, dt):
        if self.moveCooldown > 0.0:
            self.moveCooldown -= dt

        if self.moveCooldown <= 0.0 and self.game.InBounds(self.x + self.xdir, self.y + self.ydir):
            self.x += self.xdir
            self.y += self.ydir
            print 'Position is now : ' + str(self.x) + "," + str(self.y)
#            game.outmessages.put({'type': 'move', 'x':, self.x, 'y': self.y})
            self.game.server.BroadCastMessage({'type': 'move', 'x': self.x, 'y': self.y, 'entityid': self.entityid})
            self.moveCooldown = 0.5

    def serialize(self):
        return {'x': self.x, 'y': self.y, 'model': self.model, 'id': self.entityid}

class Game:
    def __init__(self):
        self.mapheight=36
        self.mapwidth=64
        self.tiles = [[0 for x in xrange(self.mapheight)] for x in xrange(self.mapwidth)]
        self.entities = {}
        self.inmessages = Queue()
        self.outmessages = Queue()
        self.nextentityid = 0
        self.packer = msgpack.Packer()
        self.server = Server(self)
        signal.signal(signal.SIGINT, self.signal_handler)
        self.gamethread = threading.Thread(target = self.run)
        self.stop = False
        self.gamethread.start()
        self.server.serve_forever()

    def signal_handler(self, signal, frame):
        print 'handlaan signaalia'
        self.stop = True
        self.gamethread.join
        self.server.stop()

    def tick(self, dt):
        try:
            while 1:
                msg = self.inmessages.get_nowait()
                self.handleMessage(msg);
        except Empty:
            pass

        for e in self.entities:
            self.entities[e].tick(dt)


    def run(self):
        self.lastsimtime = util.clock()
        while not self.stop:
            t = util.clock()
            dt = t - self.lastsimtime
            self.lastsimtime = t
            self.tick(dt)

            time.sleep(0.001)

    def handleMessage(self, message):
        print "handling message: " + str(message)
        t = message['type']
        if t == 'move':
            self.handlePlayerInput(message)
        elif t == 'connect':
            eid = self.CreatePlayerEntity()
            message['player'].entityid = eid
            message['player'].ws.send(self.packer.pack({'entities': [ self.entities[e].serialize() for e in self.entities ] }), True)
#            game.outmessages.put({'type': 'newentity', 'x':, self.entities[eid].x, 'y': self.entities[eid].y, 'model': 'player'})
            self.server.BroadCastMessage({'type': 'newentity', 'entity': self.entities[eid].serialize()})
            print 'Current entities: ' + str(len(self.entities))
        elif t == 'disconnect':
            eid = message['player'].entityid
            del self.entities[eid]
            self.server.BroadCastMessage({'type': 'deleteentity', 'entityid': eid})
        else:
            print 'Unknown packet type: ' + str(message)

    def InBounds(self, x, y):
        print 'Query with: ' + str(x) + ',' + str(y)
        ret = x>=0 and y>=0 and x<self.mapwidth and y<self.mapheight
        print 'Result: ' + str(ret)
        return ret

    def handlePlayerInput(self, message):
        xd = message['xdir']
        yd = message['ydir']
        ent = self.entities[message['player'].entityid]
        if xd != 0:
            if xd > 0:
                ent.xdir = 1
                ent.ydir = 0
            else:
                ent.xdir = -1
                ent.ydir = 0
        elif yd != 0:
            if yd > 0:
                ent.xdir = 0
                ent.ydir = 1
            else:
                ent.xdir = 0
                ent.ydir = -1 

        print 'New xdir: ' + str(ent.xdir)
        print 'New ydir: ' + str(ent.ydir)
                
    def CreatePlayerEntity(self):
        eid = self.nextentityid
        self.nextentityid += 1
        self.entities[eid] = Entity(eid, self, 'player')
        return eid


g = Game()
