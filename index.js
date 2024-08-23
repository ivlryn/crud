let btnShow = document.getElementById("btnShow");
btnShow.addEventListener('click', function() {

        let username = document.getElementById("txtName").value.trim(); // function trim ng kat space pi muk
        let pwd = document.getElementById("txtPwd").value;

        function login (username, pwd) {
            if (!username) {
                alert('please enter username!');
                return;
            }
            if (!pwd) {
                alert('please enter pw!');
                return;
            }
            if (username && pwd) {
                alert(`Hello ${username}, your pw is ${pwd}`);
                return;
            }
        }
    try {
        login(username,pwd);
    } catch (err) {
        alert(`erorr: ${err} this is an erorr`)
    }
    finally {
        alert('sucessfully')
    }
    
}); 