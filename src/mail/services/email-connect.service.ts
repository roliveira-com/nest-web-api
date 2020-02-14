import { Injectable } from "@nestjs/common";
import * as Imap from "imap";
import * as Util from "util";
import { simpleParser, MailParser } from "mailparser";

const EmailParser = new MailParser()

const Email = new Imap({
  user: "ro@roliveira.com",
  password: "",
  host: "imap.umbler.com",
  port: 993,
  tls: true,
  tlsOptions: { secureProtocol: "TLSv1_method" }
});

let mailobj = {
  attachments: [],
  text: {},
  headers: null
};

@Injectable()
export class EmailConnectService {
  private ImapServer: Imap;
  public emailResult = [];

  public routeMessages() {
    this.retrieveTheMessages();
  }

  // public retrieveTheMessages() {
  //   console.log("retrieveTheMessages() method dispatched");
  //   Email.on("ready", function() {
  //     Email.openBox("INBOX", true, function(err, box) {
  //       console.log("openInbox method dispatched");
  //       if (err) console.log(err);
  //       Email.search(["FROM", "rodrigo.olive@gmail.com"], function(
  //         err,
  //         messages
  //       ) {
  //         if (err) console.log(err);
  //         const emailFetch = Email.fetch(messages, {
  //           bodies: ["HEADER.FIELDS (FROM)", "TEXT"]
  //         });
  //         emailFetch.on("message", function(msg, seq) {
  //           msg.on("body", function(stream, info) {
  //             simpleParser(stream)
  //               .then(email => {
  //                 this.emailResult.push(email);
  //               })
  //               .catch(err => {
  //                 this.emailResult.push({ message: "Parse Error", error: err });
  //               });
  //           });
  //           msg.once("attributes", function(attrs) {
  //             console.log("Attributes: %s", Util.inspect(attrs, false, 8));
  //           });
  //           msg.once("end", function() {
  //             console.log("Finished");
  //           });
  //         });
  //         emailFetch.once("error", function(err) {
  //           console.log("Fetch error: " + err);
  //         });
  //         emailFetch.once("end", function() {
  //           console.log(this.emailResult);
  //           console.log("Done fetching all messages!");
  //           Email.end();
  //         });
  //       });
  //     });
  //   });
  // }

  public retrieveTheMessages() {
    return new Promise((resolve, reject) => {
      let emailResult = [];
      Email.on("ready", function() {
        Email.openBox("INBOX", true, function(err, box) {
          console.log("openInbox method dispatched");
          if (err) reject(err);
          Email.search(["ALL", ["FROM", "rodrigo.olive@gmail.com"]], function(
            err,
            messages
          ) {
            if (err) reject(err);
            const emailFetch = Email.fetch(messages, {
              bodies: ["HEADER.FIELDS (FROM TO SUBJECT)", "TEXT"]
            });
            emailFetch.on("message", function(msg, seq) {
              msg.on("body", function(stream, info) {
                let buffer = []

                // EmailParser.once('data', data => {
                //   // console.log(data.textAsHtml)
                //   buffer.push({ message: data.textAsHtml })
                //   // resolve({ status: "OK", result: data.textAsHtml });
                // });    
                
                // EmailParser.on("end", () => {
                //   resolve({result:buffer})
                // })

                // stream.pipe(EmailParser);
                // var buffer = "";
                // stream.on("data", function(chunk) {
                //   buffer += chunk.toString("utf8");
                //   emailResult.push(chunk.toString("utf8"));
                //   simpleParser(chunk, function() {
                //     emailResult.push({ content: chunk.toString("utf8") });
                //   });
                // });
                // stream.on("end", function() {
                //   emailResult.push(buffer);
                // });
                simpleParser(stream, {  }, function(err, mail) {
                  emailResult.push({ content: mail.textAsHtml });
                });
                // simpleParser(stream)
                //   .then(email => {
                //     emailResult.push(email);
                //     console.log()
                //   })
                //   .catch(err => {
                //     emailResult.push({
                //       message: "Parse Error",
                //       error: err
                //     });
                //   });
              });
              msg.once("attributes", function(attrs) {
                //console.log("Attributes: %s", Util.inspect(attrs, false, 8));
              });
              msg.once("end", function() {
                //console.log("Finished");
              });
            });
            emailFetch.once("error", function(err) {
              console.log("Fetch error: " + err);
            });
            emailFetch.once("end", function() {
              resolve({ status: "OK", result: JSON.stringify(emailResult) });
              console.log("Done fetching all messages!");
              Email.end();
            });
          });
        });
      });

      Email.on("mail", function(err) {
        console.log("Mail Here");
      });

      Email.on("error", function(err) {
        reject(err);
        console.log("Error on Connection", err);
      });

      Email.on("end", function() {
        console.log("Connection ended");
      });

      Email.connect();
    });
  }

  public connect() {
    console.log("connect() method dispatched");
    Email.on("ready", function() {
      console.log("IMAP on READY hook activated");
      Email.openBox("INBOX", true, function(err, box) {
        console.log("openInbox method dispatched");
        if (err) console.error(err);
        var f = Email.seq.fetch(box.messages.total + ":*", {
          bodies: ["HEADER.FIELDS (FROM)", "TEXT"]
        });
        f.on("message", function(msg, seqno) {
          console.log("Message #%d", seqno);
          var prefix = "(#" + seqno + ") ";
          msg.on("body", function(stream, info) {
            simpleParser(stream)
              .then(parsed => {
                console.log(parsed);
              })
              .catch(err => {
                console.log(err);
              });
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
    Email.on("ready", function() {
      console.log("IMAP on READY hook activated");
      Email.openBox("INBOX", true, function(err, box) {
        console.log("openInbox method dispatched");
        if (err) console.error(err);
        var f = Email.seq.fetch(box.messages.total + ":*", {
          bodies: ["HEADER.FIELDS (FROM)", "TEXT"]
        });
        f.on("message", function(msg, seqno) {
          console.log("Message #%d", seqno);
          var prefix = "(#" + seqno + ") ";
          msg.on("body", function(stream, info) {
            if (info.which === "TEXT")
              console.log(
                prefix + "Body [%s] found, %d total bytes",
                Util.inspect(info.which),
                info.size
              );
            var buffer = "",
              count = 0;
            stream.on("data", function(chunk) {
              count += chunk.length;
              buffer += chunk.toString("utf8");
              if (info.which === "TEXT") {
                console.log(
                  prefix + "Body [%s] (%d/%d)",
                  Util.inspect(info.which),
                  count,
                  info.size
                );
                console.log(prefix + "Body [%s] content", buffer);
              }
            });
            stream.once("end", function() {
              if (info.which !== "TEXT")
                console.log(
                  prefix + "Parsed header: %s",
                  Util.inspect(Imap.parseHeader(buffer))
                );
              else
                console.log(
                  prefix + "Body [%s] Finished",
                  Util.inspect(info.which)
                );
            });
          });
          msg.once("attributes", function(attrs) {
            console.log(
              prefix + "Attributes: %s",
              Util.inspect(attrs, false, 8)
            );
          });
          msg.once("end", function() {
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
