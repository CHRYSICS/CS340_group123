// add any handlebar helper functions here
module.exports = {
    ifEql: function(value1, value2, options){
        if (value1 != value2){
            return options.inverse(this);
        }else{
            return options.fn(this);
        }
    }
}