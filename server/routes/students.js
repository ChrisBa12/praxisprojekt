var studdb = require('../models/Student.js');
var modules = require('./modules.js');
var coursedb = require('../models/Course.js');
var moduledb = require('../models/Module.js');
var effortdb = require('../models/Effort.js');
var effortCatdb = require('../models/EffCategory.js');
var db = require('../server.js');

exports.clear = function () {
    studdb.studentModel.remove({}, function(err) {
        console.log('collection removed')
    });
    coursedb.courseModel.remove({}, function(err) {
        console.log('collection removed')
    });
    moduledb.moduleModel.remove({}, function(err) {
        console.log('collection removed')
    });
    effortdb.effortModel.remove({}, function(err) {
        console.log('collection removed')
    });
    effortCatdb.effCategoryModel.remove({}, function(err) {
        console.log('collection removed')
    });
};

exports.dummy = function (req, res) {

    var kurse12 = ['122-WI', '122-IBA', '122-MPE', '122-BA'];
    var kurse13 = ['132-WI', '132-IBA', '132-MPE', '132-BA'];
    var kursNamen = ['Wirtschaftsinformatik', 'International Business Administration',
        'Management, Philosophy & Economics', 'Business Administration'];
    var moduleCodes = ['ACC40020', 'ECO40020', 'QUM40020', 'ACC40040'];
    var modules = ['Financial Accounting', 'Microeconomics and Decision', 'Mathematics', 'Managerial Accounting & Controlling '];
    var effortCat = ['assignment', 'self study', 'exam preparation'];
    var effortCatID = [1,2,3];

    // Effort Kategorien anlegen
    for (i = 0; i < effortCat.length; i++){
        var eCat = new effortCatdb.effCategoryModel;
        eCat._id = effortCatID[i];
        eCat.name = effortCat[i];
        eCat.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });
    }


    // module anlegen
    for (i = 0; i < moduleCodes.length; i++){
        var mod = new moduledb.moduleModel();
        mod._id = moduleCodes[i];
        mod.name = modules[i];
        mod.workloadHours = 150;
        mod.contactHours = 60;
        mod.independentHours = 50;
        mod.assignmentHours = 40;
        mod.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });
    }

    //Kurse 2012 anlegen
    for (i = 0; i < kurse12.length; i++) {
        var course = new coursedb.courseModel();
        course._id = kurse12[i];
        course.name = kursNamen[i];
        course.classOf = 2012;
        course.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });
    }

    //Kurse 2013 anlegen
    for (i = 0; i < kurse13.length; i++) {
        var course = new coursedb.courseModel();
        course._id = kurse13[i];
        course.name = kursNamen[i];
        course.classOf = 2013;
        course.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });
    }

    //Studenten 2012 anlegen
    for (i = 0; i < 25; i++){
        var reqStudent = new studdb.studentModel();
        reqStudent._id = Math.floor((Math.random() * 1000) + 1);
        reqStudent.course = kurse12[Math.floor(Math.random() * kurse12.length)];
        reqStudent.privacyFlag = true;
        var studModules = [];
        studModules.push(moduleCodes[Math.floor(Math.random() * moduleCodes.length)]);
        reqStudent.modules = studModules;

        //effort erstellen
        var effort = new effortdb.effortModel();
        effort.amount = Math.floor((Math.random() * 10) + 1);
        effort.module = studModules;
        effort.matricularnr = reqStudent._id;
        effort.category = effortCatID[Math.floor(Math.random() * effortCatID.length)];
        effort.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });

        reqStudent.efforts.push(effort);

        reqStudent.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });
    }
    //Studenten 2013 anlegen
    for (i = 0; i < 25; i++){
        var reqStudent = new studdb.studentModel();
        reqStudent._id = Math.floor((Math.random() * 1000) + 1);
        reqStudent.course = kurse13[Math.floor(Math.random() * kurse13.length)];
        reqStudent.privacyFlag = true;
        var studModules = [];
        studModules.push(moduleCodes[Math.floor(Math.random() * moduleCodes.length)]);
        reqStudent.modules = studModules;
        reqStudent.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                return res.json(req.body);
            }
        });
    }
};

exports.checkStudent = function (req, res) {
    var studentid = req.params.id;
    var reqStudent = new studdb.studentModel(req.body);

    console.log("studentid: " + studentid);
    console.log("reqstudentid: " + reqStudent._id);

    studdb.studentModel.findOne({_id: studentid}, function (err, student) {
        if (err) {
            console.log(err);
            // If user not in DB create
        } else if (student == undefined) {
            console.log("kommt in erstellen teil");
            reqStudent.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                else {
                    return res.json(req.body);
                }
            });
            // If user is already in DB check modules for updates
        } else {
            if (modules.checkModules(reqStudent) == 1) {
                return res.json(req.body);
            } else {
                return res.SendStatus(500);
            }
        }
    });
};
