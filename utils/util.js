    //Error Handling Functions
    function wrapAsync(fn){
        return function (req, res, next){
            fn(req, res, next).catch(err=>{
               return next(err);
            })
        }
    };


module.exports = wrapAsync;