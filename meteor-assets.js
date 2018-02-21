var fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true});

var icons = [
  {name:"app_store", size: "1024x1024"},
  {name:"iphone_2x", size: "120x120"},
  {name: "iphone_3x", size: "180x180"},
  {name: "ipad", size: "76x76"},
  {name: "ipad_2x", size: "152x152"},
  {name: "ipad_pro", size: "167x167"},
  {name: "ios_settings", size: "29x29"},
  {name: "ios_settings_2x", size: "58x58"},
  {name: "ios_settings_3x", size: "87x87"},
  {name: "ios_spotlight", size: "40x40"},
  {name: "ios_spotlight_2x", size: "80x80"},
  {name: "ios_notification", size: "20x20"},
  {name: "ios_notification_2x", size: "40x40"},
  {name: "ios_notification_3x", size: "60x60"},
  {name: "iphone_legacy", size: "57x57"},
  {name: "iphone_legacy_2x", size: "114x114"},
  {name: "ipad_spotlight_legacy", size: "50x50"},
  {name: "ipad_spotlight_legacy_2x", size: "100x100"},
  {name: "ipad_app_legacy", size: "72x72"},
  {name: "ipad_app_legacy_2x", size: "144x144"},
  {name: "android_mdpi", size: "48x48"},
  {name: "android_hdpi", size: "72x72"},
  {name: "android_xhdpi", size: "96x96"},
  {name: "android_xxhdpi", size: "144x144"},
  {name: "android_xxxhdpi", size: "192x192"},
  {name: "android_store", size: "512x512"}
]

var splashes = [
  {"name":"Default@2x~iphone~anyany.png": "1334x1334"},
  {"name":"Default@2x~iphone~comany.png": "750x1334"},
  {"name":"Default@2x~iphone~comcom.png": "1334x750"},
  {"name":"Default@3x~iphone~anyany.png": "2208x2208"},
  {"name":"Default@3x~iphone~anycom.png": "2208x1242"},
  {"name":"Default@3x~iphone~comany.png": "1242x2208"},
  {"name":"Default@2x~ipad~anyany.png": "2732x2732"},
  {"name":"Default@2x~ipad~comany.png": "1278x2732"},
  {"name":"iphone","size":"320x480"},
  {"name":"iphone_2x","size":"640x960"},
  {"name":"iphone5","size":"640x1136"},
  {"name":"iphone6","size":"750x1334"},
  {"name":"iphone6p_portrait","size":"1242x2208"},
  {"name":"iphone6p_landscape","size":"2208x1242"},
  {"name":"iphoneX_portrait","size":"1242x2436"},
  {"name":"iphoneX_landscape","size":"2436x1242"},
  {"name":"ipad_portrait","size":"768x1024"},
  {"name":"ipad_portrait_2x","size":"1536x2048"},
  {"name":"ipad_landscape","size":"1024x768"},
  {"name":"ipad_landscape_2x","size":"2048x1536"},
  {"name":"android_ldpi_landscape","size":"320x200"},
  {"name":"android_mdpi_portrait","size":"320x480"},
  {"name":"android_mdpi_landscape","size":"480x320"},
  {"name":"android_hdpi_portrait","size":"480x800"},
  {"name":"android_hdpi_landscape","size":"800x480"},
  {"name":"android_xhdpi_portrait","size":"720x1280"},
  {"name":"android_xhdpi_landscape","size":"1280x720"},
  {"name":"android_xxhdpi_portrait","size":"1080x1440"},
  {"name":"android_xxhdpi_landscape","size":"1440x1080"},
  {"name":"android_featured","size":"1024x500"}
 ]

function getSize(image) {
  var sizes = image.size.split('x');
  return { width: sizes[0], height: sizes[1] }
}

// source file, target directory, image profile
function resize(source, target, image) {
  var icon = gm(source);

  var imageSize = getSize(image);
  var width = imageSize.width;
  var height = imageSize.height;
  var name = image.name;

  icon.resize(width, height)
    .write(target + name + '.png', function(err) {
      if(err) {
        console.log(err);
        console.log("Quitting because of an error");
      } else {
        console.log("Wrote " + name);
      }
    });
};

function crop(source, target, image) {
  var size;
  var splash = gm(source);

  var imageSize = getSize(image);
  var width = parseInt(imageSize.width);
  var height = parseInt(imageSize.height);
  var name = image.name;

  // square up so that it cuts off as little as possible
  if (height > width) {
    splash.resize(height, height);

    size = height;
  } else {
    splash.resize(width, width);

    size = width;
  }

  // calculate x and y offset
  var xOffset = (size/2) - (width/2);
  var yOffset = (size/2) - (height/2);

  splash.crop(width, height, xOffset, yOffset)
    .write(target + name + '.png', function(err) {
      if(err) {
        console.log(err);
        console.log("Quitting because of an error");
      } else {
        console.log("Wrote " + name);
      }
    });
}

// Run the code

if(!fs.existsSync(__dirname + '/resources/icons')) {
  fs.mkdirSync(__dirname + '/resources/icons');
}

if(!fs.existsSync(__dirname + '/resources/splashes')) {
  fs.mkdirSync(__dirname + '/resources/splashes');
}

icons.forEach(function(icon) {
  if (icon.name.indexOf('android') == 0) {
    resize('resources/icon-android.png', 'resources/icons/', icon);
  } else {
    resize('resources/icon-ios.png', 'resources/icons/', icon);
  }
});

splashes.forEach(function(splash) {
  if (splash.name.indexOf('android') == 0) {
    crop('resources/splash-android.png', 'resources/splashes/', splash);
  } else {
    crop('resources/splash-ios.png', 'resources/splashes/', splash);
  }
});
