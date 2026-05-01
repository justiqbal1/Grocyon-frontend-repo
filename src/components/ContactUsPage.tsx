import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  Sparkles,
} from "lucide-react";
import Swal from "sweetalert2";
import { apiService, ApiError } from "../services/api";

const TOPIC_LABELS: Record<string, string> = {
  general: "General inquiry",
  orders: "Order help",
  vendor: "Vendor / partner",
  press: "Press & media",
  other: "Other",
};

export default function ContactUsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Almost there",
        text: "Please fill in your name, email, and message.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const topic = TOPIC_LABELS[form.subject] ?? "General inquiry";
      const response = await apiService.submitContact({
        fullName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        topic,
        message: form.message.trim(),
      });

      if (
        typeof response.errorCode === "number" &&
        response.errorCode !== 0
      ) {
        throw new ApiError(
          response.errorMessage || "Could not send your message.",
          undefined,
          response.errorCode,
          response
        );
      }

      Swal.fire({
        icon: "success",
        title: "Message received",
        text:
          response.message ||
          "Thanks for reaching out. Our team will get back to you shortly.",
        confirmButtonColor: "#ef4444",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Could not send",
        text: message,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-gray-900">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-500/15 blur-3xl" />
        <div className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl" />

        <header className="relative border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-900 hover:opacity-90 transition-opacity"
            >
              <img
                src="/image/logo/logo_icon.jpeg"
                alt="Grocyon"
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-gray-100"
                onError={(e) => {
                  e.currentTarget.src = "/image/logo/icon.jpeg";
                }}
              />
              <span className="text-lg font-bold tracking-tight">Grocyon</span>
            </Link>
            <Link
              to="/admin-access"
              className="text-sm font-semibold text-red-600 hover:text-red-700 whitespace-nowrap"
            >
              Partner login
            </Link>
          </div>
        </header>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-gray-900 mb-5 shadow-sm"
                style={{ backgroundColor: "#FFE842" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                We are here to help
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                Let&apos;s start a{" "}
                <span className="text-red-500">conversation</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Questions about orders, partnerships, or the Grocyon platform?
                Send us a note — our support team typically replies within one
                business day.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <aside className="lg:col-span-5 space-y-5">
                <div className="rounded-2xl bg-gray-900 text-white p-8 shadow-xl shadow-gray-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-white/10 ring-1 ring-white/20">
                        <HeadphonesIcon className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-medium">
                          Customer care
                        </p>
                        <p className="text-xl font-bold">Talk to Grocyon</p>
                      </div>
                    </div>
                    <ul className="space-y-5 text-sm">
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-amber-300" />
                        </span>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-0.5">
                            Email
                          </p>
                          <a
                            href="mailto:support@grocyon.com"
                            className="text-white font-medium hover:text-amber-200 transition-colors"
                          >
                            support@grocyon.com
                          </a>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-amber-300" />
                        </span>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-0.5">
                            Phone
                          </p>
                          <a
                            href="tel:+923001234567"
                            className="text-white font-medium hover:text-amber-200 transition-colors"
                          >
                            +1 4035027990
                          </a>
                          <p className="text-gray-500 text-xs mt-1">
                            Mon–Sat, 9:00 AM – 9:00 PM
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-amber-300" />
                        </span>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-0.5">
                            Office
                          </p>
                          <p className="text-white/95 leading-snug">
                            Medicine Hat, Alberta, Canada
                            <span className="block text-gray-400 text-xs mt-1 font-normal">
                              Visit by appointment only
                            </span>
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-amber-300" />
                        </span>
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-0.5">
                            Response time
                          </p>
                          <p className="text-white/95">
                            We aim to reply within{" "}
                            <span className="text-amber-200 font-semibold">
                              24 hours
                            </span>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">
                        Vendors &amp; partners
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        For onboarding and account questions, mention your store
                        name and city in the message so we can route you faster.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-7">
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-gray-200/50"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Send a message
                  </h2>
                  <p className="text-sm text-gray-500 mb-8">
                    All fields marked with * are required.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-semibold text-gray-800 mb-2"
                      >
                        Full name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-400 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-semibold text-gray-800 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-400 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-semibold text-gray-800 mb-2"
                      >
                        Phone <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-400 outline-none transition-all"
                        placeholder="+1 ..."
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-semibold text-gray-800 mb-2"
                      >
                        Topic
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-400 outline-none transition-all appearance-none cursor-pointer bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        }}
                      >
                        <option value="general">General inquiry</option>
                        <option value="orders">Order help</option>
                        <option value="vendor">Vendor / partner</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-semibold text-gray-800 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/30 focus:border-red-400 outline-none transition-all resize-y min-h-[140px]"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-red-500 text-white font-semibold text-base shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Grocyon. Fresh groceries &amp; food, delivered.
      </footer>
    </div>
  );
}
