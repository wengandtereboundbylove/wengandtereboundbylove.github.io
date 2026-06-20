const googleForm = {
    actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeM6R3W24TEwjdLMjU9fljzrEc6QguQ5oR0xXd6-I7ILVV_Ag/formResponse",
    entries: {
        guestName: "entry.375581519",
        attendance: "entry.1158118741",
        guestCount: "entry.1888502228",
        songRequest: "entry.1472571667",
        message: "entry.1917949991"
    }
};

const rsvpForm =
    document.getElementById("rsvpForm");

const successCard =
    document.getElementById("successCard");

const formStatus =
    document.getElementById("formStatus");

function isGoogleFormConfigured() {

    return googleForm.actionUrl.includes("formResponse") &&
        Object.values(googleForm.entries).every(entry =>
            !entry.includes("REPLACE")
        );
}

function setStatus(message, type) {

    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = `form-status ${type || ""}`.trim();
}

function getSelectedAttendance() {

    const selected =
        rsvpForm.querySelector("input[name='attendance']:checked");

    return selected ? selected.value : "";
}

function getRsvpValues() {

    return {
        [googleForm.entries.guestName]:
            document.getElementById("guestName").value.trim(),
        [googleForm.entries.attendance]:
            getSelectedAttendance(),
        [googleForm.entries.guestCount]:
            document.getElementById("guestCount").value,
        [googleForm.entries.songRequest]:
            document.getElementById("songRequest").value.trim(),
        [googleForm.entries.message]:
            document.getElementById("message").value.trim()
    };
}

function showSuccess() {

    rsvpForm.closest(".rsvp-card").hidden = true;
    successCard.hidden = false;
    successCard.scrollIntoView({ behavior: "smooth" });
}

function submitToGoogleForm(values) {

    return new Promise(resolve => {

        const iframeName = "googleFormSubmitFrame";

        let iframe =
            document.querySelector(`iframe[name="${iframeName}"]`);

        if (!iframe) {

            iframe = document.createElement("iframe");
            iframe.name = iframeName;
            iframe.hidden = true;
            document.body.appendChild(iframe);

        }

        const googlePostForm =
            document.createElement("form");

        googlePostForm.action = googleForm.actionUrl;
        googlePostForm.method = "POST";
        googlePostForm.target = iframeName;
        googlePostForm.hidden = true;

        Object.entries(values).forEach(([name, value]) => {

            const input = document.createElement("input");

            input.type = "hidden";
            input.name = name;
            input.value = value;

            googlePostForm.appendChild(input);

        });

        document.body.appendChild(googlePostForm);

        iframe.addEventListener(
            "load",
            () => {

                googlePostForm.remove();
                resolve();

            },
            { once: true }
        );

        googlePostForm.submit();

        setTimeout(() => {

            if (document.body.contains(googlePostForm))
                googlePostForm.remove();

            resolve();

        }, 2500);

    });
}

if (rsvpForm && successCard) {

    rsvpForm.addEventListener("submit", async event => {

        event.preventDefault();

        if (!isGoogleFormConfigured()) {

            setStatus(
                "Google Form endpoint is set. Add the entry IDs in rsvp/main.js to finish connecting it.",
                "error"
            );

            return;
        }

        const submitButton =
            rsvpForm.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        setStatus("Sending your RSVP...", "loading");

        try {

            await submitToGoogleForm(getRsvpValues());

            showSuccess();

        } catch (error) {

            setStatus(
                "Something went wrong. Please try again.",
                "error"
            );

            submitButton.disabled = false;
            submitButton.textContent = "Submit RSVP";

        }

    });

}
