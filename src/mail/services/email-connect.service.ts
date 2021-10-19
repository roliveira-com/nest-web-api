import { Injectable } from "@nestjs/common";
import Imap from "imap";
import * as Util from "util";
import { imap } from '../../configs/email.config';
import { simpleParser } from "mailparser";

const Email = new Imap(imap.gmail);

@Injectable()
export class EmailConnectService {
  public emailResult = [];

  public searchMessagesByAddressAndDate(): Promise<any> {
    return new Promise((resolve, reject) => {
      Email.on("ready", () => {
        Email.openBox("INBOX", true, (err, box) => {
          if (err) reject(err);
          Email.search(["ALL", 
            ["FROM", "rodrigo.olive@gmail.com"], 
            ['SINCE', 'March 13, 2020']], 
          (err, messages) => {
            if (err) reject(`Error On Search ${err}`);

            const Fetch = Email.fetch(messages, { bodies: '' });
            Fetch.on('message', (msg, seqno) => {
              msg.on('body', (stream, info) => {
                simpleParser(stream, (errParser, mail) => {
                  if (errParser) reject(errParser);
                  if (mail && mail.from) {
                    this.emailResult.push({
                      date: mail.date,
                      from: mail.from.value[0].address,
                      subject: mail.subject,
                      email: mail.html
                    });
                  };
                  console.log('Message #%d - subject: ' + mail.subject, seqno);
                  if (messages.length === this.emailResult.length) {
                    resolve({ status: "OK", result: this.emailResult });
                  }
                })
              })
            })
            Fetch.on('end', () => {
              Email.end();
            })
          })          
        })
      });

      Email.on("error", (err) => {
        reject(err);
        console.log("Error on Connection", err);
      });

      Email.connect();
    })
  }

  public fetchMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      let emailResult = [];
      Email.on("ready", () => {
        Email.openBox("INBOX", true, (err, box) => {
          if (err) reject(err);
          const emailFetch = Email.seq.fetch("1:*", { bodies: '' });
          emailFetch.on("message", function (msg, seq) {
            msg.once("body", function (stream, info) {
              simpleParser(stream, function (errParser, mail) {
                if (errParser) throw new Error("Error on the parser");
                console.log('Message #%d - subject: ' + mail.subject, seq);
                if (mail && mail.from) {
                  emailResult.push({
                    from: mail.from.value[0].address,
                    subject: mail.subject,
                    email: mail.html
                  });
                };                
              });
            });
          });
          emailFetch.on("error", function (err) {
            console.log("Fetch error: " + err);
          });
          emailFetch.on("end", function () {
            resolve({ status: "OK", result: emailResult });
            console.log("Done fetching all messages!");
            Email.end();
          });          
        })
      });

      Email.on("error", (err) => {
        reject(err);
        console.log("Error on Fetching", err);
      });

      Email.connect();
    })
  }
}
