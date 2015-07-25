if (Meteor.isClient) {
  Template.hello.helpers({
    servoId: function () {
      return Session.get('SERVO_ID');
    },
    readText: function() {
      return Session.get('READTEXT');
    }
  });

  function readIt() {
    Meteor.call('readZ', function(err, res) {
      if(err) {
        console.log('err=', err);
        return;
      }
      return Session.set('READTEXT', res);
    })

  }

  readIt();

  Template.hello.events({
    'click #read': function () {
      readIt();
    },
    'click #write': function () {
      var val = $('#writeText').val();
      Meteor.call('writeZ', val, function(err, res) {
        if(err) {
          console.log('err=', err);
          return;
        }
      })
    }
  });

  Meteor.call('info', function(err, res) {
    if(err) {
      console.log('err=', err);
      return;
    }
    Session.set('SERVO_ID', res.servoId);
    console.log('res=', res);
  })

}
if (Meteor.isServer) {

  var path = Npm.require('path');
  var fs = Npm.require('fs');

  var root = process.env.CLOUD_DIR || '';
  var filename = path.join(root, 'example.txt')
  console.log(filename);

  Meteor.startup(function () {
    // code to run on server at startup

  });

  console.log('cwd=' + process.cwd());
  console.log('SERVO_ID=' + process.env.SERVO_ID);
  //var writeSync = Meteor.wrapAsync(fs.writeFile);
  //writeSync(filename, 'default text');

  function printFileLength() {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    console.log('fileLength = ' + fileSizeInBytes);
  }


  Meteor.methods({
    'info' : function() {
      return {
        servoId: process.env.SERVO_ID,
        env : process.env
      };
    },
    'writeZ': function (text) {
      console.log('write:' + text);
      fs.writeFileSync(filename, text);
      printFileLength();
    },
    'readZ': function () {
      console.log('read');
      printFileLength();
      var result = fs.readFileSync(filename, 'utf8');
      return result;
    }

  });
}
