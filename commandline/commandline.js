
//REQUIRING BUILT IN NODE MODULES

var readline = require("readline");
const events = require("events");
const cp =    require("child_process");
class _events extends events{}
var e = new _events();


//CLI OBJECT 
var cli = {};


//CHECK OS
var isWin = process.platform === "win32";

//COMMANDS

var commands = ['ls','exit','mkdir','rmdir','pwd','cd','session clear'];


//INITIALIZING THE CLI INTERFACE

cli.init = ()=>
{
      console.log("cli is Running");

      var _interface = readline.createInterface({
        input:process.stdin,
        output:process.stdout,
        prompt:'$ '

      })

      _interface.prompt();

      //READING INPUT LINE BY LINE AND PROCESS INPUT
      _interface.on("line",function(str)
    {


        
        if(!isWin)
        {
            process.chdir("cd /root");
        }
    
        cli.processInput(str);
        _interface.prompt();

    })

    _interface.on('close',()=>
{
    process.exit(0);
})

}


    //GETTING INPUT AND EMITTING EVENT CORRESPONDING TO THE INPUT

cli.processInput = (str)=>
{
  

    if(str)
    {
        var match =false;
      
        commands.some((input)=>
    {
        if(str.toLowerCase().indexOf(input)>-1)
        {
            match = true;
            e.emit(input,str);
            return true
        }
    })


    if(!match)
    {
        console.log("sorry this command doesnt exist");
    }

    }

}



//LISTENING FOR DIFFERENT COMMANDS

e.on(("ls"),(str)=>
{

   
    var command = "";
    if(isWin)
    {
        command="dir"
        
    }
    else
    {
        command="ls";
    }

    cp.exec(command,(err,stdout)=>
{
    if(err)
    {
        console.log(err);
    }
    console.log(stdout);
    
})

})


e.on("exit",(str)=>
{

    console.log("Thank you welcome")
process.exit(0);


})

e.on("cd",(str)=>
{
    var split = str.split(" ");
    var path = "";
    try{
        for(let i =1;i<split.length;i++)
    {

        path+=`${split[i]}`

    }
        
        console.log("directory is  "+process.cwd());
        process.chdir(path);
        console.log("directory changed to "+process.cwd());
    }
   
    catch(err){
        if(err &&path!="")
        {
            console.log("so such file or directory");
        }  
    }
})


e.on("mkdir",(str)=>
{


    if(str.split(" ").length==1)
    {
        console.log("invalid folder name");
        return;
    }
        cp.exec(`mkdir ${str.split(" ")[1]}`,(err,stdout)=>
    {
        console.log(stdout);
        console.log("folder created in "+process.cwd());
        
    })
    
})


e.on("rmdir",(str)=>
{

    if(str.split(" ").length==1)
    {
        console.log("invalid folder name");
        return;
    }
        cp.exec(`rmdir ${str.split(" ")[1]}`,(err,stdout)=>
    {
        console.log(stdout);
        console.log("folder removed in "+process.cwd());
        
    })
    
})


e.on("session clear",(str)=>
{
    console.log("\033[2J\033[0f");
    
    var isWin = process.platform === "win32";
    if(!isWin)
    {
        process.chdir("cd /root");
    }

   
    
    console.log("cleared and set to root")

})







e.on("pwd",(str)=>
{

   console.log("current working directory:"+process.cwd())

})






//FINALLLY STARTING THE INTERFACE

cli.init();