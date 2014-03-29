from geventwebsocket import WebSocketServer, WebSocketApplication, Resource
from Queue import Queue
import msgpack


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
            print "Unpacekd message : " + str(unpacked)
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
        self.serve_forever()
#        self.inmessages = Queue()
#        self.outmessages = Queue()

    def HandleMessage(self, message, sender):
        if message['type'] == 'chat':
            self.HandleChatMessage(message['message'], sender.playername)
        else:
            print 'Unknown message type encountered : ' + str(message)

    def HandleChatMessage(self, message, sender):
        self.BroadCastMessage({'type': 'chat', 'message': message, 'sender': sender})


    def NewConnection(self, client):
        client.playerid = self.nextid
        client.playername = 'Jorma'
        self.players[self.nextid] = (client)
        self.nextid += 1
        self.BroadCastMessage({'type': 'chat', 'message': client.playername + ' connected.'})

    def CloseConnection(self, client):
        del self.players[client.playerid]
        self.BroadCastMessage({'type': 'chat', 'message': client.playername + ' disconnected.'})

    def BroadCastMessage(self, message):
        msg = self.packer.pack(message)
        print "Packed: " + str(msg)
        disconnectedplayers = []
        for p in self.players:
            try:
                self.players[p].ws.send(msg, True)
            except:
                disconnectedplayers.append(p)
        for p in disconnectedplayers:
            self.CloseConnection(self.players[p])
        
class Game:
    def __init__(self):
        self.mapheight=100
        self.mapwidth=100
        self.tiles = [[0 for x in xrange(self.mapheight)] for x in xrange(self.mapwidth)]
        self.entities = {}
        self.inmessages = Queue()
        self.outmessages = Queue()
        self.server = Server(self)
        self.nextentityid = 0

    def tick(self, dt):
        try:
            while 1:
                msg = self.inmessages.get_nowait()
                self.HandleMessage(msg);
        except Empty:
            pass

    def handleMessage(self, message):
        t = message['type']
        if t == 'move':
            pass
        elif t == 'connect':
            eid = self.CreatePlayerEntity()
            message['player'].entityid = eid
        elif t == 'disconnect':
            del self.entities[message['player'].entityid]

    def CreatePlayerEntity(self):
        eid = self.nextentityid
        self.nextentityid += 1
        return eid


g = Game()
