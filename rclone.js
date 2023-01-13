'use strict';
process.env.TZ = 'Asia/Jakarta'
const exec = require('child_process').exec;
module.exports = {list_remote, list_file, size, dl, copy, link};

console.log('reloading rclone.js')

function parseError(err) {
    try {
      err = err.message.trim().split('\n');
      return {message: err[err.length -1]};
    } catch (e) {
      return err;
    }
}

function myExec(cmd) {
    return new Promise((resolve,reject) => {
        exec(cmd,{maxBuffer: 1024 * 50000}, (err, res) => {
            if(err) reject(parseError(err));
            resolve(res);
        })
    })
}

function parseRes(data) {
    try {
      data = data.trim().split('\n');
      return data;
    } catch (e) {
      return err;
    }
}

async function list_remote(){
    return parseRes(await myExec('rclone listremotes'));
}

async function list_file(dir,sort="title,asc"){
    // let data = await myExec(`rclone ls ${dir} --order-by '${sort}'`);
    // data = data.trim().split('\n');
    // let data_res = "";
    // data.forEach((el,i) => {
    //     let t_data = el.trim().split(/([0-9]+) (.*)/gm).filter((a) => a);
    //     data_res+=`{"size":"${t_data[0]}","filename":"${t_data[1]}"},`;
    // });
    // return JSON.parse('['+data_res.slice(0, -1)+']');
    // console.log(`rclone lsjson ${dir} --order-by '${sort}'`);
    return JSON.parse(await myExec(`rclone lsjson ${dir} --order-by '${sort}'`));
}

async function size(dir){
  // console.log(`rclone size ${dir}`)
    let data = await myExec(`rclone size ${dir}`);
    // data = data.trim().split('\n');
    // let data1 = data[0].split(': ');
    // let data2 = data[1].split(': ');
    // return JSON.parse(`{"${data1[0]}":"${data1[1]}","${data2[0]}":"${data2[1]}"}`);
    return await data.trim();
}

async function dl(id,url,dir){
  try {
    await myExec('rclone copyurl "'+url+'" "'+dir+'" -a --ignore-existing');
    return id;
  } catch (e) {
    return err;
  }
}

async function copy(id,dir,target){
  try {
    await myExec('rclone copy '+dir+' '+target)+' --ignore-existing';
    return id;
  } catch (err) {
    return err;
  }
}

async function link(filename,dir){
  try {
    let url = await myExec('rclone link "'+dir+'"');
    return {filename,url};
  } catch (err) {
    return err;
  }
}
// (async()=>{
// console.log(await list_file('cmail:M','modtime,desc'));
// })()
