const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `${selector} 写错了`
        alert(s)
        return null
    } else {
        return element
    }
}

const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)


let song = ["白若溪-追梦人", "李健-贝加尔湖畔", "李健-风吹麦浪", "张国荣-风继续吹"]
let mode = 0
let clockId1 = 1


const time = function (duration) {
    let  min = Math.floor(duration / 60) % 60
    let sec = Math.floor(duration % 60)
    if (sec < 10) {
        sec = "0" + sec
    }
    let b1 = `${min}:${sec}`
    return b1
}



const pause = function () {
    let button = e('.fa-play')
    if (!button.classList.contains('fa-pause')) {
        button.classList.add('fa-pause')
    }
}


const innerHTML = function (audio, a) {
    audio.src = `audio/${a}.mp3`
    audio.innerHTML = a
}


const songname = function (a) {
    let c1 = e('.title')
    c1.innerHTML = a
}


const duration = function (audio) {
    let b = time(audio.duration)
    let span = e('.time')
    span.innerHTML = b
}


const choice = function(array) {
    let a = Math.random()
    a *= array.length
    a = Math.floor(a)
    return a
}


const current = function (audio) {
    let name = audio.innerHTML
    for (let i = 0; i < song.length; i++) {
        if(name === song[i]) {
            return i
        }
    }
}


const randomsSong = function (audio, song) {
    let a2 = current(audio)
    let a1 = choice(song)
    if (a2 === a1) {
        a1 = choice(song)
    }
    let newName = song[a1]
    innerHTML(audio, newName)
    songname(newName)
    audio.play()
}

const NewSong = function (audio) {
    let name = audio.innerHTML
    for (let i = 0; i < song.length; i++) {
        if (name === song[i]) {
            let b = (i + 1) % song.length
            let newName = song[b]
            innerHTML(audio, newName)
            songname(newName)
        }
    }
    audio.play()
}


const NextSong = function (audio) {
    if (mode === 0) {
        NewSong(audio)
    } else {
        randomsSong(audio, song)
    }
}

const backsong = function (audio) {
    let name = audio.innerHTML
    for (let i = 0; i < song.length; i++) {
        if (name === song[i]) {
            let a = (i + song.length - 1) % song.length
            let newName = song[a]
            innerHTML(audio, newName)
            songname(newName)

        }
    }
    audio.play()
}

const ProgressPaly = function (x, max, int, audio) {
    let width = (x / max) * 100
    int.style.width = String(width) + '%'
    let cur = audio.duration * (width / 100)
    audio.currentTime = String(cur)
    audio.play()
    pause(audio)
}


const autoPlay = function(audio) {
    let int = e('.int')
    let interval = 100
    clockId1 = setInterval(function() {
        let now = audio.currentTime
        let sum = audio.duration
        let ProgressLength = (now / sum) * 100
        int.style.width = `${ProgressLength}%`
    }, interval)
}

const bindEventPlay = function(audio) {
    let button = e('.fa-play')
    button.addEventListener('click', function(event) {
        let self = event.target
        if(self.classList.contains('fa-pause')){
            self.classList.remove('fa-pause')
            audio.pause()
            clearInterval(clockId1)
        } else {
            self.classList.add('fa-pause')
            audio.play()
            autoPlay(audio)
        }
    })
}

const bindEventbackward = function (audio) {
    let button = e('.fa-fast-backward')
    button.addEventListener('click', function() {
        mode = 0
        autoPlay(audio)
        pause(audio)
        backsong(audio)
    })
}



const bindEventforward = function (audio) {
    let button = e('.fa-fast-forward')
    button.addEventListener('click', function() {
        mode = 0
        autoPlay(audio)
        pause(audio)
        NextSong(audio)

    })
}


const insertSpan = function () {
    if (mode === 0) {
        let a = e('header')
        let t = `
                 <span id="Popup">已切换循环模式</span>
                 `
        appendHtml(a, t)
    } else {
        let a = e('header')
        let t = `
                 <span id="Popup">已切换随机模式</span>
                  `
        appendHtml(a, t)
    }

}


const bindEventRepeat = function (audio) {
    let button = e('.fa-repeat')
    button.addEventListener('click', function() {
        pause(audio)
        mode = 0
        insertSpan()
        setTimeout(function() {
            let Popup = e('#Popup')
            Popup.remove()
        }, 1000)
    })
}


const bindEventRandom = function (audio) {
    let button = e('.fa-random')
    button.addEventListener('click', function() {
        pause(audio)
        mode = 1
        insertSpan()
        setTimeout(function() {
            let Popup = e('#Popup')
            Popup.remove()
        }, 1000)
    })
}

const bindEventProgress = function (audio) {
    let int = e('.int')
    let bg = e('.bg')
    let max = bg.offsetWidth
    let moving = false
    let offset = 0

    bg.addEventListener('mousedown', (event) => {
        offset = event.clientX - bg.offsetLeft
        moving = true
    })


    document.addEventListener('mouseup', () => {
        moving = false
    })

    document.addEventListener('mousemove', (event) => {
        if (moving) {
            let x = event.clientX - offset
            if (x > max) {
                x = max
            }
            if (x < 0) {
                x = 0
            }
            ProgressPaly(x, max, int, audio)
        }
    })
}

const  bindEventClickProgress = function (audio) {
    let bg = e('.bg')
    let int = e('.int')
    let max = bg.offsetWidth
    bg.addEventListener('click', (event) => {
        let len = event.offsetX
        ProgressPaly(len, max, int, audio)

    })

}

const canplay = function (audio) {
    audio.addEventListener('canplay', function() {
        duration(audio)
    })
}

const ended = function (audio) {
    audio.addEventListener('ended', function() {
        NextSong(audio)
    })
}



const bindEvents = function() {
    let audio = e('#mic_audio')
    bindEventPlay(audio)
    bindEventbackward(audio)
    bindEventforward(audio)
    bindEventRepeat(audio)
    bindEventRandom(audio)
    duration(audio)
    bindEventProgress(audio)
    bindEventClickProgress(audio)
    canplay(audio)
    ended(audio)
}

const __main = function() {
    bindEvents()


}
__main()