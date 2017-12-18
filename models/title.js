var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
    title: string
}) ;

const querymodel = mongoose.model('title',)