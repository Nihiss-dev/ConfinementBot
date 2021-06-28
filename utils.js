module.exports = {

    between : function(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
      },

    getProbability : function(percentage) {
      return this.between(0, 100) >= (100 - percentage);
    }
}