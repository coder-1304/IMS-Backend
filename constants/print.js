const print =(message)=>{
    const deploymentMode =false;
    if(!deploymentMode){
        console.log(message);
    }
}

export default print;