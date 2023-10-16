//need with 
import { Octokit } from "https://esm.sh/@octokit/rest";

function base64Decode(text, charset) {
  charset=charset||'utf-8';
  return fetch(`data:text/plain;charset=${charset};base64,` + text)
    .then(response => response.text());
}

function base64Encode(...parts) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const offset = reader.result.indexOf(",") + 1;
      resolve(reader.result.slice(offset));
    };
    reader.readAsDataURL(new Blob(parts));
  });
}  

function Gitapi(auth , owner, repo, branch, path){

  let o={}
  o.env={}
  o.env.auth  = auth //access _token
  o.env.owner = owner
  o.env.repo  = repo
  o.env.branch = branch
  o.env.path = path
  o.env.sha = null
  //
  const octokit = new Octokit({auth: auth})
  //
  o.isup=async ()=>{
    let file,oldsha =o.env.sha;
    try {
      file = await octokit.repos.getContent(Object.assign({
        owner,
        repo,
        path,
      }, !!branch ? {ref: branch} : {}))
    } catch (e) {
      file = null
      if (e.status !== 404) {
        throw e
      }
    } finally{
      o.env.sha = file ? file.data.sha : null
      //console.log(oldsha,o.env.sha)
      //var d=await base64Decode(file.data.content)
      //console.log(d,file.data.content)
    }
    return oldsha===o.env.sha ? false : true
  }
  ///////////////
  o.get=async()=>{
    let file,content
    //let Buffer=buffer.Buffer //////brower
    try {
      file = await octokit.repos.getContent(Object.assign({
        owner,
        repo,
        path,
      }, !!branch ? {ref: branch} : {}))
    } catch (e) {
      file = null
      if (e.status !== 404) {
        throw e
      }
    } finally{
      o.env.sha = file ? file.data.sha : null
      //console.log(oldsha,o.env.sha)
      content = file!=null ? await base64Decode(file.data.content): null
      console.log(content,file.data.content)
    }
    return content
  }
  //////
  o.up=async (content)=>{
    await o.isup()
    let sha = o.env.sha
    return await octokit.repos.createOrUpdateFileContents(Object.assign({
      owner,
      repo,
      path,
      message:""+Date.now(),
      content: await base64Encode(content||""),
      sha: sha,
    }, !!branch ? {branch} : {}))
  }
  ;
  return Object.assign({},o)
}
