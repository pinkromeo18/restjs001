export function Polling(fn,msec){
  let o={}
  o.msec=msec||10*1000
  o.starttime=Date.now()
  o.fn=fn
  o.id=undefined
  o.start=()=>{
    clearTimeout(o.id)    
    o.id=setTimeout(()=>{
      o.fn(o.starttime)
      o.start()
    },o.msec)
  }
  o.stop=()=>{
    clearTimeout(o.id)
    o.id=undefined
  }  
  return Object.assign({},o);
}


/*usage
import {Polling} from "https://pinkromeo18.github.io/restjs001/Polling.js"
var fn={};
fn.g=(d)=>document.getElementById(d)
//textContent
var data = fn.g("data")
var data2= fn.g("data2")
data.textContent ="1"
data2.textContent ="1"
///
var p1=Polling((starttime)=>{
  data.textContent = parseInt(data.textContent, 10) + 1
},1000)

var p2=Polling((starttime)=>{
  data2.textContent = parseInt(data2.textContent, 10) + 3
},3000)

fn.g("a").onclick=()=>{
  p1.start()
  p2.start()
}
fn.g("b").onclick=()=>{
  p1.stop()
  p2.stop()
}
*/
