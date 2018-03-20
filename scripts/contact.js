$(document).ready(function () {
    initForm();
});

function initForm() {
    var ele;
    $(document).on('keyup click', '.form-element', function (e) {
        ele = $(this);
        ele.removeClass('error');
        $('.error-notification').removeClass('show');
    })
}
//Setting map for contact page
function initMap() {
    //Initialising Google Maps
    var mapEle;
    var latLong = new google.maps.LatLng(12.9329193, 77.6028656)
    var mapOptions = {
        zoom: 15,
        center: latLong,
        mapTypeControl: false,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        scrollwheel: false,
        styles: [{
            "featureType": "water",
            "stylers": [{
                "saturation": 43
            }, {
                "lightness": -11
            }, {
                "hue": "#0088ff"
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{
                "hue": "#ff0000"
            }, {
                "saturation": -100
            }, {
                "lightness": 99
            }]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#808080"
            }, {
                "lightness": 54
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ece2d9"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ccdca1"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#767676"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#b8cb93"
            }]
        }, {
            "featureType": "poi.park",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.sports_complex",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.medical",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi.business",
            "stylers": [{
                "visibility": "simplified"
            }]
        }]
    };
    var marker = new google.maps.Marker({
        position: latLong,
        title: "Tapzo (Formerly Helpchat)",
        icon: 'images/map-marker.png'
    });
    mapEle = new google.maps.Map(document.getElementById('map'), mapOptions);
    marker.setMap(mapEle);
}

function processForm() {
    //To remove errors from all fields before validating
    $('.form-element').removeClass('error');
    //Checking each form-input
    var ele, formInput, inputType, validateResponse, errorFree;
    errorFree = true;
    $('.form-element').each(function () {
        ele = $(this);
        formInput = ele;
        inputType = ele.attr('data-form-type');

        //Send input to generic validation function
        validateResponse = validateInput(formInput, inputType);
        if (validateResponse != 'success') {
            ele.removeClass('error').addClass(validateResponse);
            errorFree = false;
        } else {
            ele.removeClass('error');
        }
    });

    //Check if the form is error free
    if (errorFree) {
        $('.error-notification').removeClass('show');
        var data={
            "name":$('#form-name').val(),
            "email": $('#form-email').val(),
            "mobile": $('#form-phone').val(),
            "message": $('#form-message').val()
        }
        $.ajax({
            type: "POST",
            url: "https://api.helpchat.in/mobileapp/v4/sendContactEmail",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function (response) {
                console.log(response);
                window.location.href = "https://www.tapzo.com/message_sent.html";
            },
            error: function (xhr, status, error) {
                window.location.href = "https://www.tapzo.com/message_sent.html";
            }
        });
        return true;
    } else {
        $('.error-notification').addClass('show');
        return false;
    }
}

//Generic function to check any type of input
function validateInput(formInput, inputType, inputRequired) {
    var inputVal, hasUpdatedVal;
    switch (inputType) {
    case 'text':
    case 'number':
        inputVal = formInput.val();
        //To check if it's required and empty
        if (!inputVal.length) return 'error';
        return 'success';
        break;
    case 'email':
        //To check if it's required and empty
        inputVal = formInput.val();
        if (!inputVal.length) return 'error';
        //Check if email is valid
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test($.trim(inputVal))) return 'error';
        return 'success';
        break;
    }
    return 'success';
}