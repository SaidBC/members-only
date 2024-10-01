const clicker = document.querySelector(".clicker");
const times = document.querySelector('.times');


clicker.addEventListener('click', () => {
    if (!document.querySelector(".member-claim-from")) {
        const timesCount = +times.textContent + 1;
        times.textContent = timesCount;
        if (timesCount >= 100) {
            times.remove()
            const memberClaimForm = document.createElement('form');
            memberClaimForm.method = "POST";
            memberClaimForm.action = "/get-membership";
            memberClaimForm.classList.add('member-claim-from')
            const claimTxt = document.createElement('p');
            claimTxt.textContent = "CONGRATS CLAIM YOUR REWARDS";
            const claimBtn = document.createElement('button');
            claimBtn.textContent = "CLAIM";

            clicker.append(memberClaimForm);
            memberClaimForm.appendChild(claimTxt)
            memberClaimForm.appendChild(claimBtn)
        }
    }
})