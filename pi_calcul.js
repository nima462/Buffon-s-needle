


function ligneInit(diametre, ctx, canvas){
    for(let indice_de_ligne = 0; indice_de_ligne <= canvas.width; indice_de_ligne+= parseInt(2*diametre)){
        //let's place the ligne depending on the size of the needle
        ctx.beginPath()
        ctx.moveTo(indice_de_ligne, canvas.height)
        ctx.lineTo(indice_de_ligne, 0)
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 2
        ctx.stroke()
        
    }
}

function pointSurLigne(row, diametre, canvas){
    for(let ligne_numero_i = 0; ligne_numero_i <= canvas.width; ligne_numero_i += diametre*2){
        if(row === ligne_numero_i ){
            return true
        }
        ligne_numero_i += diametre*2
    }
    return false
}

function OutOfRange(X_debut, X_fin, canvas){
    return((X_debut > 0 && X_debut < canvas.width) && (X_fin > 0 && X_fin < canvas.width))
}

function placePoint( nb_reference, diametre , nb_reference_ligne, ctx, canvas){
    for(let i = 0; i < nb_reference; i++){
        let row_A = (Math.random() * (canvas.width))
        let col_A = (Math.random() * (canvas.height))
        if(pointSurLigne(row_A, diametre, canvas)){
            nb_reference_ligne++
        }
        let random_angle = Math.random() * Math.PI
        //I'm using pi, without using it i'll have some trouble with the fact that my caculation will be linked with pixels, and for it 
        // to be more precise i'll have to use more pixels, but the problem with pixels is that it can only be 1 and not inifinite 0.000000...1
        // So if i need more pixels unity the page had to be bigger which is not a solution
        // I'm using pi to have some sort of irrational that helps me here. Hence my code is more to give a nice example of Buffon's needle problem
        // not a program that calculatePIithout using the knowledge we have on pi
        // -> I also tried to use a two-dimensional table to simulate monte-carlo problem (that was my orignal plan, not using pi), 
        //    where each cell is a point in a two-dimensional universe
        //    Where the user choose the number of step betwen to integers, in instance between two floats are an infinite numbers of steps
        //    where in my case the more step you input the more precise it gets, this code had some major problem
        //    I tried to make it more optimal and functional, but the more precise i wanted it the more slow it got (really slow)
        // -> I Tried using angles with degrees and not radiant, but at the end you would have to change it to radiant
        //    Or have to use cos and sin which are also tools of pi.
        let X_debut = row_A - ((diametre/2)*Math.cos(random_angle))
        let X_fin = row_A + ((diametre/2)*Math.cos(random_angle))
        if(!OutOfRange(X_debut, X_fin, canvas)){
            continue
        }

        ctx.save()
        ctx.translate(parseInt(row_A), parseInt(col_A))
        ctx.rotate(random_angle)
        ctx.beginPath()
        ctx.moveTo(0, -(diametre) / 2)
        ctx.lineTo(0, (diametre) / 2)
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1
        nb_reference_ligne = intersection(canvas, X_debut, X_fin, diametre, nb_reference_ligne, ctx)
        ctx.stroke()
        ctx.restore()
        
    }
    return(nb_reference_ligne)
}



function intersection(canvas, X_debut, X_fin, diametre, nb_reference_ligne, ctx){
    for(let ligne_numero_i = 0; ligne_numero_i <= canvas.width; ligne_numero_i += diametre*2){ 
        if(parseFloat(ligne_numero_i) >= Math.min(X_debut, X_fin) && ligne_numero_i <= Math.max(X_debut, X_fin) ){
            //it detects for each line if it is in the range of the X coordonates of the needle segment
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 2
            nb_reference_ligne++
            return nb_reference_ligne
        }
        
    }
    return nb_reference_ligne
}

//function to clear the canvas
function clear(ctx, canvas){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



function calculPI(){
    let canvas = document?.getElementById("monGraphique"), 
        ctx = canvas.getContext('2d')
    if(!canvas){
        throw new Error("no id detected for canvas")
    }
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'white'

    const button = document?.querySelector('#throw')

    button.addEventListener('click', () => {
        clear(ctx,canvas)
        // const diametre = (document?.querySelector('#diametre')?.value)
        // const pas_colonne = parseInt(document?.querySelector('#pas_colonne')?.value)
        // const pas_ligne = parseInt(document?.querySelector('#pas_ligne')?.value)
        const diametre = 10
        const nb_reference = parseInt(document?.querySelector('#nb_reference')?.value)
        ligneInit(diametre, ctx, canvas)
        let nb_reference_ligne = 0  //number of needle that crosses the line, here reference are needle.
        nb_reference_ligne = placePoint( nb_reference, diametre, nb_reference_ligne, ctx, canvas)
        if(!nb_reference_ligne){
            throw new Error("nb_reference ligne nul")
        }
        else{
            const pi = nb_reference_ligne/nb_reference
            const text = document.createElement("div")
            text.textContent = ' π = ' + pi
            text.setAttribute("class", "Pi")
            document.body.appendChild(text)
        }
    })
    
    
}

document.addEventListener('DOMContentLoaded', calculPI)
