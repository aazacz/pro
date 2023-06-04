//function to convert a string to Title Case
function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    });
  }
  



  module.exports={
    toTitleCase
  }