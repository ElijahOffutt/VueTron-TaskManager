// CONSOLE.LOG SHORTHAND
var l = function (x) {
        console.log(x)
    },

    // OPEN WEATHER API CREDENTIALS
    weatherAPICall = 'http://api.openweathermap.org/data/2.5/weather?APPID=[YourAPIKey]&units=imperial&zip=[YourZip]',

    // CACHE CURRENT TIME OF DAY 
    time = new Date().getHours(),

    // CACHE TIME OF DAY IN TO A STRING
    timeOfDay = function () {
        if (time >= 0 && time < 6) {
            return ('night')
        } else if (time >= 6 && time < 11) {
            return ('morning')
        } else if (time >= 11 && time < 17) {
            return ('day')
        } else if (time >= 17 && time < 20) {
            return ('evening')
        } else if (time >= 20) {
            return ('night')
        }
    },

    // CONNECT AND LOAD DATABASE
    Datastore = require('nedb'),
    db = new Datastore({
        filename: __dirname + '/database/data.db',
        autoload: true
    });

var app = new Vue({

    el: '#app',
    data: {

        states: {
            lists: false,
            tasks: false,
            modals: {
                show: false,
                addList: false,
                addError: false,
                restart: false,
                remove: false,
                update: false
            }
        },

        lists: [
            {
                name: 'My First Task List',
                desc: 'New begginings are fun, Hello World!',
                completed: false,
                percentage: 0,
                createdOn:  new Date().toLocaleString("en-us", {
                    month: 'numeric',
                    day: 'numeric'
                }),
                type: 'personal',
                list: [
                    {
                        content: 'My First Task',
                        checked: false
                    }
                    ]
                }
        ],

        tasks: null,

        tasksId: 0,

        newTask: null,

        newList: {
            list: {
                name: null,
                desc: null,
                type: 'personal',
            },
            types: [
                {
                    name: 'personal',
                    current: true
                },
                {
                    name: 'business',
                    current: false
                },
                {
                    name: 'fitness',
                    current: false
                }
            ]
        },

        weather: null,

        headerImage: 'url(styles/assets/images/' + timeOfDay() + '/' + (Math.floor(Math.random() * 9) + 0) + '.jpg)',

        date: new Date().toLocaleString("en-us", {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }),

    },

    methods: {

        modals(type) {

            this.states.modals.addList = false;
            this.states.modals.restart = false;
            this.states.modals.remove = false;
            this.states.modals.update = false;

            if (type == 'addList') {

                this.states.modals.addList = true;

            } else if (type == 'restart') {

                this.states.modals.restart = true;

            } else if (type == 'remove') {

                this.states.modals.remove = true;

            } else if (type == 'update') {

                this.states.modals.update = true;

            }

            this.states.modals.show = !this.states.modals.show;
            this.listFuncs('type', 0);

        },

        viewFuncs(screen, i) {

            if (screen == 'lists') {

                this.states.lists = true;

            } else if (screen == 'tasks') {

                this.tasks = this.lists[i].list;
                this.tasksId = i;

                setTimeout(function () {

                    app.$data.states.tasks = !app.$data.states.tasks;

                }, 0);

            } else if (screen == 'backToLists') {

                this.states.tasks = !this.states.tasks;

            }

        },

        listFuncs(type, typeIndex) {

            if (type == 'addList') {

                if (this.newList.list.name && this.newList.list.desc) {

                    // 
                    var list = this.newList.list,
                        newList = {
                            name: list.name,
                            desc: list.desc,
                            completed: false,
                            createdOn: new Date().toLocaleString("en-us", {
                                month: 'numeric',
                                day: 'numeric'
                            }),
                            percentage: 0,
                            type: list.type,
                            list: [{
                                content: 'Start Adding Tasks!',
                                checked: false
                            }]
                        }

                    this.lists.unshift(newList);

                    this.newList.list.name = null;
                    this.newList.list.desc = null;
                    this.newList.list.type = 'personal';
                    this.listFuncs('type', 0);

                    this.modals();

                    // UPDATE DATEBASE
                    this.updateDataBase();

                } else {

                    this.states.modals.addError = true;

                    setTimeout(function () {
                        app.$data.states.modals.addError = false;
                    }, 1000);

                }

            } else if (type == 'type') {

                // WIPE ALL CURRENTS
                for (var y = 0; y < this.newList.types.length; y++) {
                    this.newList.types[y].current = false;
                }

                // SET NEW CURRENT
                this.newList.types[typeIndex].current = true;

                // SET NEW LIST TYPE
                this.newList.list.type = this.newList.types[typeIndex].name;

            } else if (type == 'restart') {

                this.lists[typeIndex].list = this.lists[typeIndex].list.map((task) => {

                    task.checked = false;

                    return task;

                });

                this.lists[typeIndex].completed = false;

                // UPDATE DATEBASE
                this.updateDataBase();

            } else if (type == 'remove') {

                this.lists.splice(typeIndex, 1);

                // UPDATE DATEBASE
                this.updateDataBase();

            }

        },

        taskFuncs(type, i) {

            if (type == 'check') {

                this.tasks[i].checked = !this.tasks[i].checked;

                this.taskFuncs('percentage');
                this.taskFuncs('completed');

                // UPDATE DATEBASE
                this.updateDataBase();

            } else if (type == 'add') {

                if (this.newTask) {

                    var newItem = {
                        content: this.newTask,
                        checked: false
                    };

                    this.tasks.unshift(newItem);

                    this.lists[this.tasksId].completed = false;

                    this.newTask = null;

                }

                this.taskFuncs('percentage');
                this.taskFuncs('completed');

                // UPDATE DATEBASE
                this.updateDataBase();

            } else if (type == 'delete') {

                this.tasks.splice(i, 1);

                this.taskFuncs('percentage');
                this.taskFuncs('completed');

            } else if (type == 'remove') {

                this.lists.splice(this.tasksId, 1);

                this.modals();

                this.viewFuncs('backToLists');

                this.taskFuncs('completed');

                // UPDATE DATEBASE
                this.updateDataBase();

            } else if (type == 'restart') {

                this.tasks = this.tasks.map((task) => {

                    task.checked = false;

                    return task;

                });

                this.lists[this.tasksId].completed = false;

                // UPDATE DATEBASE
                this.updateDataBase();

            } else if (type == 'percentage') {

                var checkCount = 0;

                for (var x = 0; x < this.tasks.length; x++) {
                    if (this.tasks[x].checked) {
                        checkCount++;
                    }
                }

                this.lists[this.tasksId].percentage = checkCount;

            } else if (type = 'completed') {

                var checkCount = 0,
                    listLength = this.tasks.length;

                for (var x = 0; x < this.tasks.length; x++) {

                    if (this.tasks[x].checked) {
                        checkCount++;
                    }

                }

                if (checkCount === listLength) {
                    this.lists[this.tasksId].completed = true;
                } else {
                    this.lists[this.tasksId].completed = false;
                }

            }

        },

        updateDataBase() {

            db.update({
                _id: 'userData'
            }, {
                $set: {
                    lists: this.lists
                }
            });

        },

        populateData(zip) {

            // SEND GET REQUEST TO OPEN WEATHER API
            axios.get(weatherAPICall).then(function (x) {

                // SET APP WEATHER VARIABLE TO RETURNED DATA
                app.$data.weather = x.data.main;

                // ONCE GET REQUEST HAS FINNISHED
            }).catch(function (x) {
                l(x);
            });

        },

    },

    mounted() {

        // DEFUALT PUPOLATE WEATHER AND TIME
        this.populateData();

    }

});


db.find({
    _id: 'userData'
}, (err, data) => {

    if (data[0] != null &&
        data[0] != undefined &&
        data[0] != false) {

        app.$data.lists = data[0].lists;

    } else {

        var defData = {
            _id: 'userData',
            lists: [
                {
                    name: 'My First Task List',
                    desc: 'New begginings are fun, Hello World!',
                    completed: false,
                    percentage: 0,
                    createdOn: new Date().toLocaleString("en-us", {
                        month: 'numeric',
                        day: 'numeric'
                    }),
                    type: 'personal',
                    list: [
                        {
                            content: 'My First Task',
                            checked: false
                        }
                    ]
                }
            ]

        }

        db.insert(defData, (err, doc) => {

            app.$data.lists = doc[0].lists;

        });

    }

});
