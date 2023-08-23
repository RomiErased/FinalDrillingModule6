const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('./index.js');

chai.use(chaiHttp);
