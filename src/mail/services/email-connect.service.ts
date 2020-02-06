import { Injectable } from "@nestjs/common";
import * as Imap from "imap";
import * as Util from "util";
import { simpleParser } from 'mailparser'

const Email = new Imap({
  user: "ro@roliveira.com",
  password: "",
  host: "imap.umbler.com",
  port: 993,
  tls: true,
  tlsOptions: { secureProtocol: "TLSv1_method" }
});

@Injectable()
export class EmailConnectService {
  private ImapServer: Imap;

  // public openInbox(cb) {
  //   this.ImapServer.openBox("INBOX", true, cb);
  // }

  public connect() {
    console.log("connect() method dispatched");
    Email.on("ready", function() {
      console.log("IMAP on READY hook activated");
      Email.openBox("INBOX", true, function(err, box) {
        console.log("openInbox method dispatched");
        if (err) console.error(err);
        var f = Email.seq.fetch(
          box.messages.total + ':*',
          { bodies: ['HEADER.FIELDS (FROM)', 'TEXT'] }
        );
        f.on("message", function(msg, seqno) {
          console.log("Message #%d", seqno);
          var prefix = "(#" + seqno + ") ";
          msg.on("body", function(stream, info) {
            simpleParser(stream)
              .then(parsed => {
                console.log(parsed)
              })
              .catch(err => {
                console.log(err)
              })
            // var buffer = "";
            // stream.on("data", function(chunk) {
            //   buffer += chunk.toString("utf8");
            // });
            // stream.on("end", function() {
            //   // console.log(buffer)
            //   console.log(
            //     prefix + "Parsed header: %s",
            //     Util.inspect(Imap.parseHeader(buffer))
            //   );
            // });
          });
          msg.on("attributes", function(attrs) {
            console.log(
              prefix + "Attributes: %s",
              Util.inspect(attrs, false, 8)
            );
          });
          msg.on("end", function() {
            console.log(prefix + "Finished");
          });
        });
        f.on("error", function(err) {
          console.log("Fetch error: " + err);
        });
        f.on("end", function() {
          console.log("Done fetching all messages!");
          Email.end();
        });
      });
    });

    Email.on("mail", function(err) {
      console.log("Mail Here");
    });

    Email.on("error", function(err) {
      console.log("Error on Connection", err);
    });

    Email.on("end", function() {
      console.log("Connection ended");
    });

    Email.connect();
  }

  public getFirstMessage() {
    console.log("connect() method dispatched");
    Email.on("ready", function () {
      console.log("IMAP on READY hook activated");
      Email.openBox("INBOX", true, function (err, box) {
        console.log("openInbox method dispatched");
        if (err) console.error(err);
        var f = Email.seq.fetch(
          box.messages.total + ':*',
          { bodies: ['HEADER.FIELDS (FROM)', 'TEXT'] })
        f.on("message", function (msg, seqno) {
          console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function (stream, info) {
            if (info.which === 'TEXT')
              console.log(prefix + 'Body [%s] found, %d total bytes', Util.inspect(info.which), info.size);
            var buffer = '', count = 0;
            stream.on('data', function (chunk) {
              count += chunk.length;
              buffer += chunk.toString('utf8');
              if (info.which === 'TEXT') {
                console.log(prefix + 'Body [%s] (%d/%d)', Util.inspect(info.which), count, info.size);
                console.log(prefix + 'Body [%s] content', buffer);
              }
            });
            stream.once('end', function () {
              if (info.which !== 'TEXT')
                console.log(prefix + 'Parsed header: %s', Util.inspect(Imap.parseHeader(buffer)));
              else
                console.log(prefix + 'Body [%s] Finished', Util.inspect(info.which));
            });
          });
          msg.once('attributes', function (attrs) {
            console.log(prefix + 'Attributes: %s', Util.inspect(attrs, false, 8));
          });
          msg.once('end', function () {
            console.log(prefix + 'Finished');
          });
        });
        f.on("error", function (err) {
          console.log("Fetch error: " + err);
        });
        f.on("end", function () {
          console.log("Done fetching all messages!");
          Email.end();
        });
      });
    });

    Email.on("mail", function (err) {
      console.log("Mail Here");
    });

    Email.on("error", function (err) {
      console.log("Error on Connection", err);
    });

    Email.on("end", function () {
      console.log("Connection ended");
    });

    Email.connect();
  }
}
