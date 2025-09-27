<template>
  <div class="bg-gray-50 text-black min-h-screen">
    <Navbar />

    <section class="max-w-6xl mx-auto px-6 py-20">
      <h2 class="text-4xl font-bold text-center mb-12">Contact Us</h2>

      <div class="grid md:grid-cols-2 gap-12">
        <!-- Form -->
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Name</label>
            <input
                type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your Name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Email</label>
            <input
                type="email"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Message</label>
            <textarea
                rows="5"
                class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Write your message..."
            ></textarea>
          </div>

          <button
              type="submit"
              class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>

        <!-- Contact Info -->
        <div class="space-y-6">
          <p class="text-lg leading-relaxed">
            Have any questions or inquiries? Reach out to us and we’ll get back to you as soon as possible.
          </p>
          <div>
            <p><strong>Email:</strong> info@nextlevelgems.com</p>
            <p><strong>Phone:</strong> +420 123 456 789</p>
            <p><strong>Instagram:</strong> @nextlevel_gems</p>
          </div>


        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../../components/Navbar.vue";
</script>
