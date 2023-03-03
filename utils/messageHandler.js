const axios = require('axios')
module.exports = {
  student : async(msg) => {
    let request_student = await axios.get('http://localhost:3000/students')
    let student = request_student.data
    console.log(student)
    if (request_student.status == 200) {
      return true
    }
    return false
  },
  teacher : async(msg) => {
    let request_teacher = await axios.get('http://localhost:3000/teachers')
    let teacher = request_teacher.data
    console.log(teacher)
    if (request_teacher.status == 200) {
      return true
    }
    return false
  }
}