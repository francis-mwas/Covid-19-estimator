const morgan = require("morgan");

morgan.token("response-time", () => {
  let start = new Date();
  let end = new Datae() * 0.5;
  let timeDiff = start - end;
  timeDiff = Math.round(timeDiff); // Removing decimals
  timeDiff = timeDiff.toString().padStart(2, 0); // ensuring u have atleast two digits
  timeDiff = +timeDiff; // converting back to integer

  return timeDiff;
});

const morgan = require("morgan");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/access.log"),
  { flags: "a" }
);
app.use(
  morgan(":method\t\t:url\t\t:status\t\t0:total-time[0]ms", {
    stream: accessLogStream
  })
);
