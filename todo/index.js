'use strict';
// { name: name of task, isDone: truth value whether complted }
const tasks = [];
/**
 * adding task
 * @param {string} taskName
 */
function add(taskName){
    tasks.push({ name: taskName, isDone: false });
}

/**
 * get object include truth value whether completed and name of task, and then return whether completed.
 * @param {object} task
 * @return {boolean} whether completed
 */
function isDone(task){
    return task.isDone;
}

/**
 * get object include truth value whether completed and name of task, and then return whether not completed.
 * @param {object} task
 * @return {boolean} whether not completed
 */
function isNotDone(task){
    return !isDone(task);
}

/**
 * get array of list of task 
 * @return {array}
 */
function list() {
    return tasks
      .filter(isNotDone)
      .map(task => task.name);
  }

/**
 * task's state change ofa completed
 * @param {string} taskName
 */
function done(taskName){
    const indexFound = tasks.findIndex(task => task.name === taskName);
    if(indexFound !== -1){
        tasks[indexFound].isDone = true;
    }
}

/**
 * get array of list of task completed
 * @return {array}
 */
function donelist() {
    return tasks 
    .filter(isDone)
    .map(task => task.name);
}
/**
* remove list of done
* @param {string} taskName
*/
function del(taskName) {
    const indexFound = tasks.findIndex(task => task.name === taskName);
    if (indexFound !== -1) {
      tasks.splice(indexFound, 1);
    }
  }
  
module.exports = {
    add,
    list,
    done,
    donelist,
    del
};
 