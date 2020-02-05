import { Injectable } from "@nestjs/common";
import * as Imap from "imap";
import * as Util from "util";

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
        var f = Email.seq.fetch("1:3", {
          bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
          struct: true
        });
        f.on("message", function(msg, seqno) {
          console.log("Message #%d", seqno);
          var prefix = "(#" + seqno + ") ";
          msg.on("body", function(stream, info) {
            var buffer = "";
            stream.on("data", function(chunk) {
              buffer += chunk.toString("utf8");
            });
            stream.on("end", function() {
              console.log(
                prefix + "Parsed header: %s",
                Util.inspect(Imap.parseHeader(buffer))
              );
            });
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
}
