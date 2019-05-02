function initialise() {
    initialiseAnimatedElements();
}

function tester() {
    throttle(mousemove, 50, this, []);
}


/*
    THROTTLE FUNCTION
    method  : the method to run
    delay   : the minimum delay between when the method is run
    context : the context to run the method with
    args    : argumets to pass to the function    
*/

const throttle = (method, delay, context, args) => {
    if (method.timeout == null)
        method.timeout = setTimeout(function () {
            method.timeout = null;
            method.call(context, args);
        }, delay);
}


/*
    USAGE:

    TO ANIMATE AN ELEMENT INTO VIEW OR OUT OF VIEW:
        animation-data="____"
            @required
            fade-in-right
            slide-in-left
        animation-complete 
            add this to the class list so the .scss knows that this element is in the animated state
        animation-trigger="ID OF TRIGGER ELEMENT"
            trigger element will cause animation to begin when it enters the viewport
        animation-trigger-position="top-bottom"
            [position of element]-[position on screen]
            positions: top, centre, bottom
        animation-hide="true"
            do this if you want the element to animate out when the user scrolls past the trigger

        on load
            initialiseAnimatedElements()
        on scroll (initialised by the loading method)
            scrollHandler()

    TO CREATE A PARALLAX SCROLLING EFFECT:
        parallax-scroll-ratio:
            @required
            determines how far this object will translate per 100 pixels moved
            0 = no movement, 1 = 100 pixels moved, 1.4 = 140 pixels moved

        on load
            initialiseAnimatedElements()
        on scroll (initialised by the loading method)
            parallaxMoveScrollEvent()
            parallaxMoveMouseEvent()

*/

const ANIMATION_COMPLETE = "animation-complete";
const defaultTriggerPosition = "top-top";
var animatedElements;
var parallaxScrolledElements;
var lastMouseX = 0, lastMouseY = 0;

/*
    COMMON
*/

function initialiseAnimatedElements() {
    // get all the animated elements
    animatedElements = getAnimated();

    // for each element, add some data to the object
    animatedElements.forEach(element => {

        // set up where the element will appear and disappear
        element.position = {
            show: getRevealPosition(element.node),
            hide: getHidePosition(element.node)
        }
    });

    // get all the parallax scrolled elements
    parallaxScrolledElements = getParallaxScrolled();

    // for each element add some data to the object
    parallaxScrolledElements.forEach(element => {

        // set up where the element will appear and disappear
        element.scrollRatio = parseFloat(element.node.getAttribute("parallax-scroll-ratio"));
        element.position = {
            y: calculateVerticalOffset(element.node) + (element.node.offsetHeight / 2),
            x: calculateHorizontalOffset(element.node) + (element.node.offsetWidth / 2)
        };

        element.offset = {
            x: 0,
            y: 0
        };
    });

    window.addEventListener('scroll', function (event) {
        throttle(scrollHandler, 50, this, arguments);
    }
    );
    const mouseParallaxThrottle = 20;
    // TODO: disable mouse parallax scrolling on mobile devices
    window.addEventListener('mousemove', function (event) { throttle(parallaxMoveMouseEvent, mouseParallaxThrottle, this, arguments) });
    window.addEventListener('scroll', function (event) { throttle(parallaxMoveScrollEvent, mouseParallaxThrottle, this, arguments) });
}

/*
    ELEMENT ANIMATION
*/

// a function that returns an array of all the animated elements in the document
function getAnimated() {
    // get all of the variables that contain an attribute animation-data
    // add each of these to an array where the node is put in an object
    return Array.prototype.map.call(document.querySelectorAll("[animation-data]"), node => ({
        node
    }));
}

// gets an animation option from the element
// returns either the value found or the defualt value
function getOption(element, option, defaultValue = false) {
    // get the attribute
    const attribute = element.getAttribute('animation-' + option);

    // if the attribute was found, return it
    if (attribute != null)
        return attribute
    // otherwise return the default value
    return defaultValue;
};

// calculate the scroll position where an element should be revealed based on the 'animation-trigger' option
// and the 'animation-trigger-position' option
function getRevealPosition(element) {
    // the trigger point is when the trigger element reaches the top of the screen
    let triggerPoint = getTriggerElementVerticalOffset(element);

    // now add additional offset to the trigger position based on the 'animation-trigger-position' option
    // get the option value, default value is "top-top"
    let triggerPosition = getOption(element, "trigger-position", defaultTriggerPosition);
    // split the option up to get the element postiion and screen element separately
    triggerPosition = triggerPosition.split("-");
    // also get the trigger element height
    let triggerHeight = getTriggerElement(element).offsetHeight;

    // add offset for the position in the element
    switch (triggerPosition[0]) {
        case "center":
        case "centre":
            triggerPoint += triggerHeight / 2;
            break;
        case "bottom":
            triggerPoint += triggerHeight;
        // To trigger at the top of the element, no change needed
    }

    // add offset for the position on the screen
    switch (triggerPosition[1]) {
        case "center":
        case "centre":
            triggerPoint -= window.innerHeight / 2;
            break;
        case "bottom":
            triggerPoint -= window.innerHeight;
        // to trigger at the top of the screen, no need to change the value
    }

    return triggerPoint;
}

// calculate the scroll position where an element should be hidden based on the 'animation-trigger' option
function getHidePosition(element) {
    // check if the user wants to hide the object once it has been scrolled past
    if (getOption(element, "hide") != false)
        // the hide point is when the trigger element reaches the bottom of the screen
        return getTriggerElementVerticalOffset(element) + window.innerHeight;

    // if the user wants to keep the object in view permanently
    // put a very big value 
    // TODO: make this better, just in case the page is super long
    return window.innerHeight * 300;
}

// takes an element, finds its trigger element and then calculates the offset for that trigger element
function getTriggerElementVerticalOffset(element) {
    // get the trigger element
    let trigger = getOption(element, 'trigger');

    //by default the trigger element is itself
    let triggerElement = element;

    // if the trigger option exists and there is an element with the given id, then set 
    // that element to be the trigger element
    if (trigger && document.getElementById(trigger))
        triggerElement = document.getElementById(trigger);

    // the vertical offset is the offset of the trigger element
    return calculateVerticalOffset(triggerElement);
}

// returns the element that should trigger the animation for the given element using the animation-trigger option
function getTriggerElement(element) {
    // get the anchor element option
    return trigger = document.getElementById(getOption(element, 'trigger'));
}

// gets the total vertical position of an element in pixels
function calculateVerticalOffset(element) {
    // start with an offset value of 0
    let offsetY = 0;

    while (element && !isNaN(element.offsetTop)) {
        // add the offset of this element (from its parent) to the offset value
        offsetY += element.offsetTop;

        // possible useful for elements that have internal scroll
        //- (element.tagName != 'BODY' ? el.scrollTop : 0)

        // get the elements parent and loop to find its offset
        element = element.offsetParent;
    }

    // return the calculated offset
    return offsetY;
}

// gets the total horizontal position of an element in pixels
function calculateHorizontalOffset(element) {
    // start with an offset value of 0
    let offsetX = 0;

    while (element && !isNaN(element.offsetLeft)) {
        // add the offset of this element (from its parent) to the offset value
        offsetX += element.offsetLeft;

        // possible useful for elements that have internal scroll
        //- (element.tagName != 'BODY' ? el.scrollTop : 0)

        // get the elements parent and loop to find its offset
        element = element.offsetParent;
    }

    // return the calculated offset
    return offsetX;
}

// is called on every scroll event to check if a new element needs to be called in
function scrollHandler() {

    // get the position in pixels of the top of the window
    var scrollPosition = window.pageYOffset;
    //console.log("scroll position >> " + scrollPosition);

    /* 
    note to self: below it is assumed that hide position > show position
    
    for each animated element, 
        is the scroll position > hide position?
            hide this element
        is scroll position > show position?
            show the element
        has the element been shown?
            hide the element                  
    */

    animatedElements.forEach(element => {
        //console.log("show  >> " + element.position.show + "\nhide >> " + element.position.hide);
        if (scrollPosition > element.position.hide)
            hideElement(element);
        else if (scrollPosition > element.position.show)
            showElement(element);
        else if (element.animated)
            hideElement(element);
    });
}

// a function that shows an element
function showElement(element) {
    // if the element is animated already just stop
    if (element.animated) return;

    // add 'animation complete' to the class list
    element.node.classList.add(ANIMATION_COMPLETE);

    // set that the element had been animated
    element.animated = true;
}

// a function that causes an element to animate out
function hideElement(element) {
    // if the element isnt animated yet just stop
    if (!element.animated) return;

    // remove 'animation complete' from the class list
    element.node.classList.remove(ANIMATION_COMPLETE);

    // set that the element had not been animated
    element.animated = false;
}

/*
    PARALLAX SCROLLING
*/

// a function that handles changing the translation of parallax scrolled elements
// this funciton should be called when the mousemove event is triggered
function parallaxMoveMouseEvent(args) {
    //update the last mouse position 
    lastMouseX = args[0].clientX;
    lastMouseY = args[0].clientY;
    parallaxRecalculate();
}

// a function that handles changing the translation of paralleax scrolled elements
// this funciton should be called when the scroll event is triggered 
function parallaxMoveScrollEvent(args) {
    parallaxRecalculate();
}

// the method that actually recalculates the translation of parallax scrolled elements
// given the x and y co-ordinates
function parallaxRecalculate() {
    let mouseOffsetX = window.scrollX + lastMouseX;
    let mouseOffsetY = window.scrollY + lastMouseY;
    var totalOffsetX, offsetChangeX;
    var totalOffsetY, offsetChangeY;

    // for each element, recalculate the offset and change the translation
    parallaxScrolledElements.forEach(element => {
        totalOffsetX = -element.scrollRatio * ((mouseOffsetX - element.position.x) / 10);
        totalOffsetY = -element.scrollRatio * ((mouseOffsetY - element.position.y) / 10);

        offsetChangeX = Math.abs(element.offset.x - totalOffsetX);
        offsetChangeY = Math.abs(element.offset.y - totalOffsetY);
        transitionTime = Math.max(offsetChangeX, offsetChangeY);

        element.node.style.transitionDuration = (10 * Math.sqrt(transitionTime * 10)) + "ms";

        element.offset.x = totalOffsetX;
        element.offset.y = totalOffsetY;

        element.node.style.transform = "translate(" + totalOffsetX + "px, " + totalOffsetY + "px)";
    });
}

// a function that returns all the parallax scrolled elements in the document, each in an object
function getParallaxScrolled() {
    // get all of the variables that contain an attribute parallax-scroll-ratio
    // add each of these to an array where the node is put in an object
    return Array.prototype.map.call(document.querySelectorAll("[parallax-scroll-ratio]"), node => ({
        node
    }));
}
