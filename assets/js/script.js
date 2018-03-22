var UserForm = (function() {
  'use strict';

  var self = {},
    inputName = [
      'firstname', 'lastname', 'email', 'phone', 'birthday'
    ],
    lengthInputName = inputName.length,
    json = {},
    cleavePhone,
    errors = [];

  self.init = function() {
    toastr.options.progressBar = true;
    var form = document.querySelector('.userform');
    prepareJson('form', 'userform');

    // phone
    cleavePhone = new Cleave('#phone', {
      phone: true,
      phoneRegionCode: 'FR'
    });
    $('#birthday').dateRangePicker({
      customOpenAnimation: function(cb) {
        $(this).fadeIn(300, cb);
      },
      customCloseAnimation: function(cb) {
        $(this).fadeOut(300, cb);
      },
      monthSelect: true,
      yearSelect: [
        1900, moment().get('year')
      ],
      startOfWeek: 'monday',
      autoClose: true,
      singleDate: true,
      showShortcuts: false,
      singleMonth: true,
      format: 'DD-MM-YYYY',
    });

    form.addEventListener('submit', validAndSubmitUserForm);
  }

  var validAndSubmitUserForm = function(event) {
    event.preventDefault();
    var index = 0,
      isValid = true,
      hasErrors = false;
    errors = [];

    for (; index < lengthInputName; index++) {
      var key = inputName[index],
        element = document.getElementById(key);

      var isValid = checkInput(key, element);
      var parent = element.parentNode;

      if (isValid) {
        parent.classList.remove('error');
        parent.querySelector('p').innerHTML = '';
        prepareJson(key, element.value);
      } else {
        parent.classList.add('error');
        parent.querySelector('p').innerHTML = errors[key];
        hasErrors = true;
      }
    }

    if (hasErrors) {
      toastr.error('The form is invalid')
    } else {
      openModal(JSON.stringify(json));
    }
  }

  var checkInput = function(key, element) {
    if (!element) {
      return false;
    }

    var isValid = true,
      value = element.value;

    switch (key) {
      case 'phone':
        var rawValue = cleavePhone.getRawValue();
        if (rawValue.length !== 10) {
          isValid = false;
          errors[key] = 'Phone is incorrect';
        }
        break;
      case 'email':
        isValid = validateEmail(value);
        errors[key] = 'Email is incorrect';
        break;
      default:
        if (value === '') {
          isValid = false;
          errors[key] = key + ' is empty';
        }

    }

    return isValid;
  }

  var prepareJson = function(key, value) {
    json[key] = value;
  }

  var openModal = function(value) {
    var modal = document.getElementById('modal'),
      content = modal.firstElementChild;

    var p = document.createElement('p');
    p.innerHTML = value;
    content.appendChild(p);

    modal.style.display = 'block';
    setTimeout(function() {
      content.classList.add('active');
    })

    document.body.addEventListener('click', closeModal);
  }

  var closeModal = function() {
    var modal = document.getElementById('modal'),
      content = modal.firstElementChild;

    content.innerHTML = '';
    modal.style.display = 'none';
    content.classList.remove('active');
    document.body.removeEventListener('click', closeModal);

  }

  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  var validateEmail = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return self;

}());

UserForm.init();
