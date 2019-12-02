const mailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const schedule = require("node-schedule");
const user = process.env.USER;
const pass = process.env.PASS;

//邮件端口和登录
const transport = mailer.createTransport(
  smtpTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true,
    auth: {
      user: user,
      pass: pass
    }
  })
);

const mailOptions = {
  from: `西门互联天气预报测试 <${user}>`, // 如果不加<xxx@xxx.com> 会报语法错误 Error: Mail command failed: 553 Mail from must equal authorized user
  to: "380863274@qq.com", // list of receivers
  subject: "天气爬虫", // Subject line
  text: `1111111111111`,
  html: " <p>天气爬虫！！！！！</p> " // html body
};


async function sendEmailData(){
  try {
      let transporter = transport
      let info = await transporter.sendMail(mailOptions)
      if(info){
        console.log('Message sent: ' + info.response);
      }
      
  } catch(error) {
      console.log('error is ->', error)
  }
}

//异步  不用用同步 同步报错   Error: Message failed: 554 DT:SPM 163 

sendEmailData().catch(console.error);



//定时器 每日预定天气预报 准时8点发送
const scheduleCronstyle = () => {
  schedule.scheduleJob("0 59 23 * * *", () => {
    console.log(new Date());
  });
};

// scheduleCronstyle();



module.exports = {
  transport,
  mailOptions,
  sendEmailData,
  scheduleCronstyle
};
