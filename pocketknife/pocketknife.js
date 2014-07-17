var _  = require('underscore')
    fs = require('fs');

// pass a response if the callback is real
var passResponseFromSource = function (err, data, source, callback){
  if(typeof callback == 'function'){
    callback(err, data);
  }else{
    console.log("Please specify callback for " + source + ".");
  }
}

// Sort an object by its keys
var sortByKeys = function(obj){
    var keys = _.sortBy(_.keys(obj), function(a) { return a; });
    var newmap = {};
    _.each(keys, function(k) {
        newmap[k] = obj[k];
    });
    return newmap;
}

// Indexed version of `map`
// (Int -> a -> b) -> [a] -> [b]
var mapWithIndex = function(arr, f){
  var idx = 0;
  arr.map(function(x){
    f(idx, x);
    idx++;
  });
}

// Replicate an item `n` times and return a list.
var replicate = function(n, item){
  var list = [];
  for (var i = 0; i < n; i++) {
    list.push(item);
  };
  return list;
}

// safely chain accesses to an object
var accessSafe = function(obj, keys, defaultValue){
  var value = 
    _.foldl(keys, function(object, key){
      if(object === null || object === undefined || object[key] === undefined || object[key] === null){
        return defaultValue
      }else{
        return object[key];
      }
    }, obj);
    return value;
};

// Check if a value is *actually* bad, not just falsy (i.e. 0, '')
var badValue = function(a){
  return _.isNull(a) || _.isUndefined(a) || _.isNaN(a);
}

// recursively remove all falsy elements of an object
var recCompact = function(obj){
  var compacted = compactObject(obj);
  return _.object(
      _.keys(compacted), 
        _.map(
          compacted, function(val){        
            if(val instanceof Array){
              return _.filter(val, function(x){ return !badValue(x); } );
            }else if(typeof val === 'object'){
              return recCompact(val);
            }else{
              return val;
            }
          }
        )
      );
}

// maps keys in an object to a new set of keys
// via an array of pairings ['oldname', 'newname']
var remapKeys = function(obj, keyMappings){
  var keys = _.keys(obj);
  var newKeys = _.map(keys, function(key){
    return _.find(keyMappings, function(keyMap){
        return keyMap[0] == key;
      })[1];
  });
  return _.object(newKeys, _.values(obj));
}

// if `obj` exists, call `f` on it. Otherwise return a default value.
var maybe = function(f, def, obj){
  if(obj === null || obj === undefined){
    return def;
  }else{
    return f(obj);
  }
};

// Split a filepath into sections.
var splitPath = function(path){
  return path.split("/");
}

// Write a file, even if the directories leading up to it don't exist.
var strictWriteFile = function(path, contents){
  var locs = splitPath(path);
  
  for(var i = 1; i < locs.length; i++){
    var newPath = _.take(locs, i).join("/");
    if(!fs.existsSync(newPath)){
      fs.mkdirSync(newPath);
    };
  };

  fs.writeFileSync(locs.join("/"), contents);
}

var namespace = {
  passResponseFromSource : passResponseFromSource,
  sortByKeys : sortByKeys,
  mapWithIndex : mapWithIndex,
  replicate : replicate,
  accessSafe : accessSafe,
  badValue : badValue,
  recCompact : recCompact,
  remapKeys : remapKeys,
  maybe : maybe,
  splitPath : splitPath,
  strictWriteFile : strictWriteFile,
  _ : _
};

module.exports = namespace;