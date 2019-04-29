



function initialise(){

    window.addEventListener('scroll', onScroll);
}

function onScroll(){
    console.log
}









/* 
------------------------------------------------------------------------------------------------------------------------------
FIRST ATTEMPT
------------------------------------------------------------------------------------------------------------------------------

for (var i = 0; i < sections.length; i++) {
        // bottom of the viewport (px)
        const scrollPosition = sp();
        // top of the section (px)
        const sectionStart = sections[i].offsetTop;

        // if we are still before the section, then it has no opacity
        if (scrollPosition < sectionStart)
            sections[i].style.opacity = 0;
        else {
            //offset within the current section
            const offset = scrollPosition - sectionStart;

            if (i = 1) {

                var children = Array.prototype.filter.call(sections[i].childNodes, function (node) {
                    if (node.className != null) return node.className.includes("background");
                    else return false;
                });

                const childCount = children.length;
                const currentTransition = Math.floor(offset / window.innerHeight);
                console.log(" >> " + scrollPosition);
                console.log(sectionStart);
                console.log(offset);
                console.log(currentTransition);
                // if this is section 2, determine which part we are in
                // set previous parts to fully on and current part to some value //, %
                var screenHeight = sections[i].clientHeight / childCount;

                for (var e = 0; e < currentTransition; e++)
                    children[e].style.opacity = 1;

                children[currentTransition].style.opacity = clamp(1, 0, (offset / screenHeight) - currentTransition);

                for (var e = currentTransition + 1; e < childCount; e++)
                    children[e].style.opacity = 0;

                return
            }

            // otherwise scroll in within the first 1/3
            const sectionSize = sections[i].clientHeight / 2;
            sections[i].style.opacity = clamp(1, 0, offset / sectionSize);


        }
    }

=============================================================================================================================

------------------------------------------------------------------------------------------------------------------------------
SEDOND ATTEMPT
------------------------------------------------------------------------------------------------------------------------------


    // bottom of the viewport (px)
    const scrollPosition = sp();

    for (var i = 0; i < sections.length; i++) {
        // top of the section (px)
        const sectionStart = sections[i].offsetTop;

        // if we are still before the section, then it has no opacity
        if (scrollPosition > sectionStart + sections[i].clientHeight)
            sections[i].style.opacity = 1;
        else {
            //offset within the current section
            const offset = scrollPosition - sectionStart;
            sections[i].style.opacity = clamp(offset / (window.innerHeight / 2.2), 0, 1);

            if (i = 0) {
                var children = Array.prototype.filter.call(sections[i].childNodes, function (node) {
                    if (node.className != null) return node.className.includes("background");
                    else return false;
                });

                const currentScreen = Math.floor(offset / (sections[i].clientHeight / children.length));
                const screenOffset = (offset / (sections[i].clientHeight / children.length)) - currentScreen;

                // previous screens
                for(var e = 0; e < children.length; e++){
                    children[e].style.opacity = 1;
                }

                children[currentScreen].style.opacity = screenOffset;

                for(var e = currentScreen + 1; e < children.length; e++){
                    children[e].style.opacity = 0;
                }

            }

            break;
        }
    }
*/

/*

var sections;
var lastScrollPosition;
var ongoingAnimations;
var animatedElements;

function getScrollPosition() {
    return window.scrollY + window.innerHeight;
}


function animateScroll() {

    // check scroll direction
    const newScrollPosition = getScrollPosition();
    const forward = newScrollPosition > lastScrollPosition;
    const scrollDelta = Math.abs(newScrollPosition - lastScrollPosition);

    // did anything new come into the viewport?
    if (sections == null) sections = Array.from(document.getElementsByTagName('section'));
    const currentSection = getCurrentSection(newScrollPosition);
    const sectionOffset = newScrollPosition - sections[currentSection].offsetTop;
    animatedElements[currentSection].forEach(element => {
        if (element.beginOffset < sectionOffset && !isAnimating(element.element) && element.endOffset > sectionOffset)
            //begin the animation
            ongoingAnimations.push(createAnimation(element.element, element.getAttribute("in"), forward));
    });

    // update all ongoing animations
    var animationDelta = scrollDelta / window.innerHeight;
    ongoingAnimations.forEach(animation => animation.update(forward, animationDelta));

    // remove animations that are finished
    ongoingAnimations = ongoingAnimations.filter(animation => !animation.complete);

    lastScrollPosition = newScrollPosition;
}

function tester() {
    document.getElementById("overlay").style.display = "block";
}

function isAnimating(element) {
    for (var i in ongoingAnimations)
        if (ongoingAnimations[i].element == element) return true;

    return false;
}

function getCurrentSection(position) {
    for (var i = 0; i < sections.length; i++)
        if (position <= sections[i].offsetTop) return i - 1;

    return sections.length - 1;
}

const LEFT = "LEFT";
const RIGHT = "RIGHT";
const UP = "UP";
const DOWN = "DOWN";

class Animation {

    constructor(duration, element, reverse) {
        this.complete = false;
        this.duration = duration;
        this.element = element;
        this.reverse = reverse;
        if (reverse)
            this.currentDuration = this.duration - 0.0000001;
        else
            this.currentDuration = 0.0000001;
    }

    update(forward, delta) {
        this.animate(forward, delta);
    }
}

class SlideAnimation extends Animation {
    constructor(distance, duration, element, reverse, direction) {
        super(duration, element, reverse);
        this.distance = distance;
        this.direction = direction;
    }

    animate(forward, delta) {
        if (forward) this.currentDuration += delta;
        else this.currentDuration -= delta;

        if (this.currentDuration > this.duration) {
            this.element.style.transform = "translate(0%, 0%)";
            this.complete = true;
            return
        } else if (this.currentDuration < 0) {
            SlideAnimation.startingPosition(this.element, this.direction)
            this.complete = true;
            return
        }

        var tempDirection = this.direction;
        if (!forward) tempDirection = this.reverseDirection(tempDirection);


        var translation = this.element.style.transform.match(/\+?\-?\d+(\.\d+)?/g);
        var currentTranslateX = parseFloat(translation[0]);
        var currentTranslateY = parseFloat(translation[1]);
        const translationChange = (delta / this.duration) * this.distance * 100;

        if (tempDirection == LEFT) currentTranslateX -= translationChange;
        else if (tempDirection == RIGHT) currentTranslateX += translationChange;
        else if (tempDirection == UP) currentTranslateY += translationChange;
        else if (tempDirection == DOWN) currentTranslateY -= translationChange;

        this.element.style.transform = "translate(" + currentTranslateX + "%, " + currentTranslateY + "%)";


    }

    reverseDirection(direction) {
        if (direction == LEFT) return RIGHT;
        if (direction == RIGHT) return LEFT;
        if (direction == UP) return DOWN;
        if (direction == DOWN) return UP;
    }

    static startingPosition(element, direction) {
        var translateX = 0;
        var translateY = 0;

        if (direction == LEFT) translateX = (parseFloat(element.getAttribute("distance")) * 100);
        else if (direction == RIGHT) translateX = -(parseFloat(element.getAttribute("distance")) * 100);
        else if (direction == UP) translateY = -(parseFloat(element.getAttribute("distance")) * 100);
        else if (direction == DOWN) translateY = (parseFloat(element.getAttribute("distance")) * 100);

        element.style.transform = "translate(" + translateX + "%," + translateY + "%)";
    }

}

class AnimatedElement {
    constructor(element) {
        this.element = element;
        this.beginOffset = element.getAttribute("beginOffset") * window.innerHeight;
        this.endOffset = this.beginOffset + (element.getAttribute("duration") * 0.7 * window.innerHeight);
    }

    getAttribute(attribute) {
        return this.element.getAttribute(attribute);
    }
}

function clamp(a, b, c) {
    return Math.max(b, Math.min(c, a));
}

function initialise() {
    // initialise the last scroll position
    lastScrollPosition = getScrollPosition();

    ongoingAnimations = [];
    animatedElements = [];

    //get animated elements, sorted by section
    var sections = Array.from(document.getElementsByTagName("section"));
    for (var i in sections) {
        animatedElements.push([]);
        var animations = Array.from(sections[i].getElementsByTagName("animated"));
        for (e in animations) {
            animatedElements[i].push(new AnimatedElement(animations[e]));
        }
    }

    var animation = "";
    // put animated elements in their starting positions
    animatedElements.forEach(section => {
        section.forEach(element => {
            // get the animation type
            animation = element.getAttribute("in");
            // slide animations
            if (animation.includes("slide")) {
                animation = animation.replace("slide", "");
                animation = animation.trim();
                animation = animation.toUpperCase();

                SlideAnimation.startingPosition(element.element, animation);
            }

        });
    });

    window.addEventListener('scroll', animateScroll);
    window.addEventListener('scroll', function () {
        console.log("scroll event");
    });
    console.log("loaded");
}

function createAnimation(element, animation, reverse) {
    if (animation.includes("slide")) {
        animation = animation.replace("slide", "");
        animation = animation.trim();
        animation = animation.toUpperCase();
        return new SlideAnimation(parseFloat(element.getAttribute("distance")), parseFloat(element.getAttribute("duration")), element, !reverse, animation);
    }
}
*/
