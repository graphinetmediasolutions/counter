 document.addEventListener('DOMContentLoaded', () => {
            // Function to start counters for a specific group using a selector
            function DSKstartCountersInGroup(selector) {
                const group = document.querySelector(selector); // Select the group based on the passed selector
                if (!group) return; // Exit if the group is not found

                const counters = group.querySelectorAll('.counter'); // Select counters in the current group
                const duration = +group.dataset.duration; // Fetch duration from data attribute

                // Create Intersection Observer
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const counter = entry.target; // Get the currently visible counter
                            animateCounter(counter, duration); // Animate the visible counter
                            observer.unobserve(counter); // Stop observing this counter after it starts
                        }
                    });
                }, {
                    threshold: 0.1 // Trigger when 10% of the counter is visible
                });

                counters.forEach(counter => observer.observe(counter)); // Observe each counter
            }

            // Function to animate a single counter
            function animateCounter(counter, duration) {
                const { target, prefix = '', suffix = '' } = counter.dataset; // Destructure attributes
                let startValue = 0; // Initialize starting value
                const endValue = +target; // Convert target to a number
                const startTime = performance.now(); // Record the start time

                function updateCount(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1); // Progress from 0 to 1
                    startValue = Math.ceil(endValue * progress); // Increment based on progress

                    // Update counter content with styled prefix and suffix
                    counter.innerHTML = `
                <span class="counter-prefix">${prefix}</span>
                <span class="counter-value">${startValue}</span>
                <span class="counter-suffix">${suffix}</span>
            `;

                    // If the animation is complete, set the final value and stop
                    if (progress < 1) {
                        requestAnimationFrame(updateCount); // Continue until complete
                    } else {
                        counter.innerHTML = `
                    <span class="counter-prefix">${prefix}</span>
                    <span class="counter-value">${endValue}</span>
                    <span class="counter-suffix">${suffix}</span>
                `;
                    }
                }

                requestAnimationFrame(updateCount); // Start animation
            }

            // Start counters for different groups using their selectors
            DSKstartCountersInGroup('.counters-group'); // Initialize first counter group
            DSKstartCountersInGroup('.counters-group-2'); // Initialize second counter group (if exists)
        });
