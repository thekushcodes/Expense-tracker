import { supabase } from "../js/supabase.js";


// ============================================================
// LOGIN
// ============================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        try {

            const { data, error } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            console.log("Login successful:", data);

            alert("Login successful.");

            loginForm.reset();

            // Temporary behavior.
            // Later we will redirect the user to the dashboard.
            window.location.reload();

        } catch (error) {

            console.error("Login error:", error);

            alert(error.message);

        }

    });

}


// ============================================================
// SIGNUP
// ============================================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;


        // -------------------------
        // Validation
        // -------------------------

        if (!name || !email || !password) {

            alert("Please fill in all fields.");

            return;

        }


        if (password.length < 6) {

            alert("Password must be at least 6 characters.");

            return;

        }


        try {

            const { data, error } =
                await supabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            full_name: name
                        }

                    }

                });


            if (error) {
                throw error;
            }


            console.log("Signup successful:", data);


            /*
             * Supabase may require email confirmation.
             *
             * If email confirmation is enabled,
             * the user will receive a confirmation email.
             */

            if (data.user && !data.session) {

                alert(
                    "Account created. Please check your email to confirm your account."
                );

            } else {

                alert("Account created successfully.");

            }


            signupForm.reset();


        } catch (error) {

            console.error("Signup error:", error);

            alert(error.message);

        }

    });

}


// ============================================================
// CHECK CURRENT SESSION
// ============================================================

async function checkSession() {

    try {

        const {
            data: { session },
            error
        } = await supabase.auth.getSession();


        if (error) {
            throw error;
        }


        if (session) {

            console.log(
                "User is currently logged in:",
                session.user.email
            );

        } else {

            console.log("No user is currently logged in.");

        }


        return session;


    } catch (error) {

        console.error(
            "Error checking session:",
            error
        );

        return null;

    }

}


// ============================================================
// AUTH STATE LISTENER
// ============================================================

supabase.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Supabase auth event:",
            event
        );


        if (session) {

            console.log(
                "Authenticated user:",
                session.user.email
            );

        } else {

            console.log(
                "No authenticated user."
            );

        }

    }
);


// ============================================================
// INITIALIZE
// ============================================================

checkSession();