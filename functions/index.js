/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'UK CSA';

exports.newOrder = functions.firestore
    .document('orders/{userId}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      console.log(snap.data())
          const email = newValue.userOrdering.email;
          const displayName = newValue.displayName;
          const mailOptions = {
            from: `${APP_NAME} <donoreply@uky.edu>`,
            to: email,
          };
          const store = admin.firestore()
          store.collection('email').doc('emailText').get().then(doc => {
              if (doc.exists) {
                const emailText = doc.data().emailText
                mailOptions.subject = `Your UKCSA Order Has Been Placed`;
                mailOptions.html = emailText;
                mailTransport.sendMail(mailOptions)
                return Promise.resolve("Finished")
              }
              else {
                return Promise.resolve("Finished")
              }
          }).catch(reason => {
              console.log(reason)
          })
            return console.log('Order Confirmation email sent.');
    });


