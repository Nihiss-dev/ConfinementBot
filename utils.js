const fs = require('fs');

var infos = {
	messageId : "",
	Role : ""
}

module.exports = {
    loadIdToRole : function() {
        var contents = fs.readFileSync("data.json");
        /*var jsonContent = JSON.parse(contents);
        return jsonContent;*/
        return contents;
    },

    writeIdtoRole : function(messageId, role) {
        infos.messageId = messageId;
        infos.Role = role;
        console.log(JSON.stringify(infos));
        var infoString =JSON.stringify(infos);
        fs.writeFileSync("data.json", infoString);
    },

    writeId : function(Id) {
        var infoString =JSON.stringify(Id);
        fs.writeFileSync("data.json", infoString);
    }
}