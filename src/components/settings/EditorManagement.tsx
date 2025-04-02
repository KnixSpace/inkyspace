"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  createInvite,
  resendInvite,
  deleteInvite,
  removeEditor,
  getPendingInvites,
  getEditors,
  type Invite,
  type Editor,
} from "@/lib/apis/invite";
import { showMessage } from "@/components/ui/MessageBox";
import {
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  UserCircle2,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { addDays, format, formatDistanceToNow, parseISO } from "date-fns";
import { mapApiErrors } from "@/lib/apis/api";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

const EditorManagement = () => {
  const [activeTab, setActiveTab] = useState<"editors" | "invites">("editors");
  const [editors, setEditors] = useState<Editor[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "editors") {
        const response = await getEditors();
        if (response.success && response.data) {
          console.log(response.data);
          setEditors(response.data);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load editors. Please try again.",
          });
        }
      } else {
        const response = await getPendingInvites();
        if (response.success && response.data) {
          setInvites(response.data);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load invites. Please try again.",
          });
        }
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddEmail = () => {
    if (emails.length >= 5) {
      setEmailError("You can only invite up to 5 editors at a time");
      return;
    }

    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (emails.includes(email)) {
      setEmailError("This email has already been added");
      return;
    }

    setEmails([...emails, email]);
    setEmail("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleInvite = async () => {
    if (emails.length === 0) {
      showMessage({
        type: "error",
        message: "Please add at least one email to invite editors.",
      });
      return;
    }

    setIsInviting(true);
    try {
      const response = await createInvite(emails);
      if (response.success) {
        showMessage({
          type: "success",
          message: `Successfully sent invitations to editors.`,
        });
        setEmails([]);
        fetchData();
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      console.log(error);
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    setActionInProgress(inviteId);
    try {
      const response = await resendInvite(inviteId);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Invitation resent successfully!",
        });
        fetchData();
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    setActionInProgress(inviteId);
    try {
      const response = await deleteInvite(inviteId);
      if (response.success) {
        setInvites(invites.filter((invite) => invite.inviteId !== inviteId));
        showMessage({
          type: "success",
          message: "Invitation deleted successfully!",
        });
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRemoveEditor = async (inviteId: string) => {
    setActionInProgress(inviteId);
    try {
      const response = await removeEditor(inviteId);
      if (response.success) {
        setEditors(editors.filter((editor) => editor.inviteId !== inviteId));
        showMessage({
          type: "success",
          message: "Editor removed successfully!",
        });
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Editor Management</h2>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "editors"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("editors")}
          >
            Editors
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "invites"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("invites")}
          >
            Pending Invites
          </button>
        </div>
      </div>

      {activeTab === "editors" ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : editors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You don't have any editors yet.
              </p>
              <button
                onClick={() => setActiveTab("invites")}
                className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium"
              >
                Invite Editors
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {editors.map((editor) => (
                <div
                  key={editor.userId}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center gap-4"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {editor.avatar ? (
                      <Image
                        src={editor.avatar || "/placeholder.svg"}
                        alt={editor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                        <UserCircle2 className="text-purple-500" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{editor.name}</h3>
                    <p className="text-gray-600 text-sm">{editor.email}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="mr-3">
                        Joined{" "}
                        {formatDistanceToNow(new Date(editor.createdOn), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleRemoveEditor(editor.inviteId)}
                      disabled={actionInProgress === editor.inviteId}
                      className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {actionInProgress === editor.userId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 size={14} />
                        </>
                      )}
                      <span className="ml-1">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Invite New Editors</h3>
            <div className="flex mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter email address"
                className={`flex-1 px-4 py-2 border-2 border-dashed rounded-md ${
                  emailError ? "border-rose-500" : "border-gray-300"
                }`}
                disabled={isInviting}
              />
              <button
                onClick={handleAddEmail}
                disabled={isInviting}
                className="ml-2 p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
            </div>
            {emailError && (
              <p className="text-rose-500 text-sm mb-2">{emailError}</p>
            )}

            <div className="mt-4">
              {emails.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-gray-500 hover:text-rose-500"
                        disabled={isInviting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic mb-4">
                  No emails added yet
                </p>
              )}

              <button
                onClick={handleInvite}
                disabled={emails.length === 0 || isInviting}
                className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isInviting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Send Invitations
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Pending Invitations</h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : invites.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No pending invitations
              </p>
            ) : (
              <div className="space-y-4">
                {invites.map((invite) => (
                  <div
                    key={invite.inviteId}
                    className="py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{invite.userEmail}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>
                          Sent{" "}
                          {formatDistanceToNow(new Date(invite.updatedOn), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          Expires{" "}
                          {format(
                            addDays(parseISO(invite.updatedOn), 7),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResendInvite(invite.inviteId)}
                        disabled={actionInProgress === invite.inviteId}
                        className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-purple-100 text-purple-700 hover:bg-purple-200"
                      >
                        <div className="mr-1">
                          <RefreshCw
                            size={14}
                            className={
                              actionInProgress === invite.inviteId
                                ? "w-4 h-4 animate-spin"
                                : ""
                            }
                          />
                        </div>
                        <span>Resend</span>
                      </button>

                      <button
                        onClick={() => handleDeleteInvite(invite.inviteId)}
                        disabled={actionInProgress === invite.inviteId}
                        className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorManagement;
