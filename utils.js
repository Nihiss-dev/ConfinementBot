const URL = require("url").URL;

module.exports = {

    between : function(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
      },

    getProbability : function(percentage) {
      return this.between(0, 100) >= (100 - percentage);
    },

    isStringURL : function(string) {
      try {
        new URL(string);
        return true;
      }
      catch (err) {
        return false;
      }
    }
}