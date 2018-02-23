
    (function() {
      function warn() {
        if (window.console) {
          console.warn.apply(console, arguments);
        }
      }

      Polymer({
        is: 'paper-time-picker',
        properties: {
          /**
           * The selected time
           */
          time: {
            type: String,
            value: '00:00',
            notify: true,
            observer: '_timeChanged' 
          },
          /**
           * The time value as the number of minutes(if enableSeconds then number of seconds) from midnight
           */
          rawValue: {
            type: Number,
            value: 0,
            notify: true,
            observer: '_rawValueChanged'
          },
          /**
           * The current 24-hour value (0-24)
           */
          hour: {
            type: Number,
            observer: '_hourChanged',
            notify: true,
            value: 0
          },
          /**
           * The current 12-hour value (0-12)
           */
          hour12: {
            type: Number,
            notify: true,
            observer: '_hour12Changed'
          },
          /**
           * The current minute (0-59)
           */
          minute: {
            type: Number,
            notify: true,
            observer: '_minuteChanged',
            value: 0
          },
          /**
           * The current second (0-59)
           */
           second: {
            type: Number,
            notify: true,
            observer: '_secondChanged',
            value: 0
          },
          /**
           * The current period ('AM', 'PM')
           */
          period: {
            type: String,
            notify: true,
            observer: '_periodChanged',
            value: 'AM'
          },
          /**
           * The current selector view ('hours' or 'minutes')
           */
          view: {
            type: String,
            notify: true,
            value: 'hours',
            observer: '_viewChanged'
          },
          /**
           * Maximum screen width at which the picker uses a vertical layout
           */
          responsiveWidth: {
            type: String,
            value: '560px'
          },
          /**
           * Force narrow layout
           */
          forceNarrow: {
            type: Boolean,
            value: false
          },
          /**
           * Whether or not to animate the clock hand between selections
           */
          animated: {
            type: Boolean,
            value: false
          },
          narrow: {
            type: Boolean,
            reflectToAttribute: true,
            value: false,
            notify: true,
          },
          isTouch: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
          },
          enableSeconds: {
            type: Boolean,
            value: false
          },
          _queryMatches: {
            type: Boolean,
            value: false,
            observer: '_computeNarrow'
          }
        },
        behaviors: [
          Polymer.IronResizableBehavior
        ],
        observers: [
          '_updateTime(hour, minute, second)'
        ],
        listeners: {
          'iron-resize': '_resizeHandler',
          'paper-clock-selected': '_onClockSelected'
        },
        ready: function() {
          this.isTouch = 'ontouchstart' in window;
          this.view = 'hours';
        },
        _timeChanged: function(time) {
          if (!time) {
            this.rawValue = 0;
            return;
          }

          var parsed = this.parseTime(time);
          var cleanedTime = this.formatTime(parsed.hour, parsed.minute, parsed.second);
          if (cleanedTime !== time) {
            this.time = cleanedTime;
            return;
          }
          var rawValue = (parsed.hour * 60) + parsed.minute;
          if (this.enableSeconds) {
            rawValue = (rawValue * 60) + parsed.second;
          }
          this.rawValue = rawValue;
        },
        _updateTime: function(hour, minute, second) {
          var rawValue = (hour * 60) + minute;
          if (this.enableSeconds) {
            rawValue = (rawValue * 60) + second;
          }
          this.rawValue = rawValue;
        },
        formatTime: function(hour, minute, second) {
          var period = (hour % 24) < 12 ? 'AM' : 'PM';
          hour = hour % 12 || 12;
          minute = ('0' + minute).substr(-2);
          second = ('0' + second).substr(-2);
          if (this.enableSeconds) {
            minute += ':' + second;
          }
          return hour + ':' + minute + ' ' + period;
        },
        parseTime: function(timeString) {
          var pattern = /^\s*(\d{1,2}):?(\d{2})(:?(\d{2}))?(\s*([AaPp])\.?[Mm]\.?|[A-Z])?\s*$/;
          var match = timeString.match(pattern);
          if (!match) {
            warn('Invalid time:', timeString);
            return;
          }
          var hour = parseInt(match[1]);
          var minute = parseInt(match[2]);
          var second = match[4] ? parseInt(match[4]) : 0;
          var period = match[6] ? (match[6][0].toUpperCase() + 'M') : 'AM';
          if (period === 'PM' && hour < 12) {
            hour = (hour + 12) % 24;
          } else if (period === 'AM' && hour === 12) {
            hour = 0;
          }
          return {hour: hour, minute: minute, second: second};
        },
        togglePeriod: function() {
          this.period = (this.period === 'AM') ? 'PM' : 'AM';
        },
        _rawValueChanged: function(value, oldValue) {
          if (isNaN(parseInt(value))) {
            this.rawValue = oldValue;
            return;
          }
          if (this.enableSeconds) {
            this.hour = Math.floor(value / 3600);
            this.minute = Math.floor(value / 60) % 60;
            this.second = value % 60;
          } else {
            this.hour = Math.floor(value / 60);
            this.minute = value % 60;
            this.second = 0;
          }
          this.time = this.formatTime(this.hour, this.minute, this.second);
        },
        _hour12Changed: function(hour12) {
          var add = (this.period === 'PM' ? 12 : 0);
          this.hour = ((hour12 % 12) + add) % 24;
        },
        _hourChanged: function(hour, oldValue) {
          hour = parseInt(hour);
          if (isNaN(hour) && !hour) {
            return;
          }
          if (isNaN(hour)) {
            warn('Invalid number:', hour);
            this.hour = oldValue;
            return;
          }
          hour = parseFloat(hour) % 24;
          this.hour = hour;
          this.hour12 = this._twelveHour(hour);
          this.period = ['PM', 'AM'][+(hour < 12)];
        },
        _minuteChanged: function(minute) {
          minute = parseFloat(minute) % 60;
          this.minute = minute;
        },
        _secondChanged: function(second) {
          second = parseFloat(second) % 60;
          this.second = second;
        },
        _periodChanged: function(period) {
          if (isNaN(parseInt(this.hour)) || isNaN(parseInt(this.minute))) {
            return;
          }
          if (period === 'AM' &&  this.hour >= 12) {
            this.hour -= 12;
          } else if (period === 'PM' && this.hour < 12) {
            this.hour += 12;
          }
        },
        _zeroPad: function(value, length) {
          if (value === undefined || isNaN(value) || isNaN(length)) {
            return;
          }
          return ('0' + value).substr(-length);
        },
        _twelveHour: function(hour) {
          return hour % 12 || 12;
        },
        _isEqual: function(a, b) {
          return a === b;
        },
        _getMediaQuery: function(forceNarrow, responsiveWidth) {
          return '(max-width: ' + (forceNarrow ? '' : responsiveWidth) + ')';
        },
        _computeNarrow: function() {
          this.set('narrow', this._queryMatches || this.forceNarrow);
        },
        _viewChanged: function(toView, fromView) {
          this.$.pages._notifyPageResize();

          // prevent the clock-hand transition when selecting, otherwise the 
          // extra movement would be confusing
          if (this._selecting || !fromView || !toView || !this.animated) {
            return;
          }

          var clocks = {'hours': this.$.hourClock, 'minutes': this.$.minuteClock, 'seconds': this.$.secondClock};
          var from = clocks[fromView];
          var to = clocks[toView];
          var fromAngle = (360 / from.count) * from.selected;
          var toAngle = (360 / to.count) * to.selected;

          // transition both clock hands at the same time
          to.setClockHand(fromAngle, false);
          from.setClockHand(toAngle);

          this.async(function() {
            to.setClockHand(toAngle, true, function() {
              this.async(function() {
                from.setClockHand(fromAngle, false);
              }, 200);
            }.bind(this));
          }.bind(this));
        },
        _onClockSelected: function(event) {
          if (this.view === 'hours') {

            var showMinutes = function() {
              this.async(function() {
                this._selecting = true;
                this.view = 'minutes';
                this._selecting = false;
              }.bind(this), 100);
              this.$.hourClock.removeEventListener('paper-clock-transition-end', showMinutes);
            }.bind(this);

            if (event.detail.animated) {
              this.$.hourClock.addEventListener('paper-clock-transition-end', showMinutes);
            } else {
              showMinutes();
            }

            if (this.hour12 !== event.detail.value) {
              this.hour12 = event.detail.value;
            } else {
              // show minutes if same hour is selected
              showMinutes();
            }
          } else if (this.view === 'minutes' && this.enableSeconds) {

            var showSeconds = function() {
              this.async(function() {
                this._selecting = true;
                this.view = 'seconds';
                this._selecting = false;
              }.bind(this), 100);
              this.$.minuteClock.removeEventListener('paper-clock-transition-end', showSeconds);
            }.bind(this);

            if (event.detail.animated) {
              this.$.minuteClock.addEventListener('paper-clock-transition-end', showSeconds);
            } else {
              showSeconds();
            }

            if (this.minute !== event.detail.value) {
              this.minute = event.detail.value;
            } else {
              // show seconds if same minute is selected
              showSeconds();
            }
          }
        },
        _resizeHandler: function() {
          if (!this.offsetWidth || this._resizing) {
            return;
          }
          this.updateStyles();
          this.async(function() {
            this._resizing = true;
            this.$.pages._notifyPageResize();
            this._resizing = false;
          }.bind(this));
        }
      });
    })();
  