const Room = require('../model/schema');
module.exports.index = async(req,res,next)=>{
    const rooms = await Room.find();
    res.render('Listings.ejs', {rooms});
};

module.exports.newRoom = (req,res,next)=>{
    res.render('new.ejs');
};

module.exports.itemDetail =  async(req,res,next)=>{
    
    const {id} = req.params;
    const room = await Room.findById(id)
    .populate({path:'reviews', 
        populate:{path:'author'}
    })
    .populate('owner');
    if(!room){
        req.flash('error', 'User not found on this id');
        // return next(new ExpressError(402, "Invalid Id"))
        res.redirect('/listings');
    }
    res.render("itemsDetails.ejs",{room});
};

module.exports.addRoom = async(req,res,next)=>{
    const{listing} = req.body;
    listing.owner = req.user._id
    const room =  new Room(listing);
    await room.save();
    req.flash('success', 'New Room Added');
    res.redirect('/listings');
};

module.exports.edit = async(req,res,next)=>{
    const {id} = req.params;
    const room = await Room.findById(id);
    if(!room){
        req.flash('error', 'User not found on this id');
        // return next(new ExpressError(402, "Invalid Id"))
        res.redirect('/listings');
    }
    res.render('edit.ejs', {room});
};

module.exports.editRoom = async(req,res,next)=>{
    const {id} = req.params;
    const{listing} = req.body;
    const room = await Room.findByIdAndUpdate(id,{...listing});
    req.flash('success', 'Room updated');
    res.redirect(`/listings/${id}`);
};

module.exports.deleteRoom =  async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return next(new ExpressError(404, `item not found on this ${id}`))
     };
    const room = await Room.findByIdAndDelete(id);
    req.flash('success', 'One room deleted');
    res.redirect('/listings');
}