db = connect("localhost:27017/habitrpg");
var cursor = db.users.find();

while ( cursor.hasNext() ){
  obj = cursor.next();
  tasks = [];
  tasks.push.apply(tasks, obj.tasks["todos"]);
  tasks.push.apply(tasks, obj.tasks["dailys"]);
  tasks.push.apply(tasks, obj.tasks["habits"]);
  tasks.forEach(function(elem) {
    db.tasks.insert( tasks );
  });
}
