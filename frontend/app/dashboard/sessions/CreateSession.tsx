"use client";
import InPageLoading from "@/components/ui/loading/InPageLoading";
import Input from "@/components/ui/Input/Input";
import BaseModal from "@/components/ui/modal/BaseModal";
import Button from "@/components/ui/button/Button";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import DatePicker from "@/components/ui/datePicker/DatePicker";
import TimePicker from "@/components/ui/timePicker/TimePicker";
import { toDateValue } from "@/utils/time.util";
import { useAuth } from "@/context/auth.context";
import { GroupServices } from "@/services/client/group.client";
import { SessionServices } from "@/services/client/session.client";
import { IGroupType } from "@/types/groupTypes";
import { ISessionTypes, Session } from "@/types/sessionTypes";
import { validateSessionForm } from "@/validations";
import { AxiosError } from "axios";
import { Clock } from "lucide-react";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { SESSION_MESSAGES } from "@/constants/messages/session.messages";
import { COMMON_MESSAGES } from "@/constants/messages/common.messages";

const pad = (num: number) => String(num).padStart(2, "0");

const getDurationLabel = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return "";
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const totalMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  if (totalMinutes <= 0) return "";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [hours && `${hours}h`, minutes && `${minutes}m`]
    .filter(Boolean)
    .join(" ");
};

function CreateSession({
  onClose,
  type,
  data,
}: {
  onClose: (sessionDate?: Session) => void;
  type: string;
  data: ISessionTypes | null;
}) {
  const [myGroups, setMyGroups] = useState<IGroupType[]>([]);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    sessionName: data?.sessionName || "",
    subject: data?.subject || "",
    date: data?.date ? toDateValue(new Date(data.date)) : "",
    startTime: data?.startTime
      ? new Date(data.startTime).toTimeString().slice(0, 5)
      : "",
    endTime: data?.endTime
      ? new Date(data.endTime).toTimeString().slice(0, 5)
      : "",
    groupId: (data?.groupId as IGroupType)?._id || "",
  });

  const [err, setErr] = useState({
    sessionName: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    groupId: "",
  });
  const [loading, setLoading] = useState(false);

  const today = toDateValue(new Date());
  const isToday = formData.date === today;
  const duration = getDurationLabel(formData.startTime, formData.endTime);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartNow = () => {
    const now = new Date();
    setFormData((prev) => ({
      ...prev,
      startTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    }));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(() => {
      return {
        sessionName: "",
        subject: "",
        date: "",
        startTime: "",
        endTime: "",
        groupId: "",
      };
    });
    const result = validateSessionForm(formData);

    if (result.status) {
      try {
        if (type == "create") {
          const response: Session = await SessionServices.createSession(
            formData
          );
          toast.success(SESSION_MESSAGES.SESSION_CREATED);
          onClose(response);
        } else {
          const response: Session = await SessionServices.updateSession(
            formData,
            data?._id as string
          );
          toast.success(SESSION_MESSAGES.SESSION_UPDATED);
          onClose(response);
        }
      } catch (err: unknown) {
        const error = err as AxiosError<string>;
        toast.error(error.message || COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED);
      }
    } else {
      setErr(() => {
        return {
          sessionName: result.errors.sessionName as string,
          subject: result.errors.subject as string,
          date: result.errors.date as string,
          startTime: result.errors.startTime as string,
          endTime: result.errors.endTime as string,
          groupId: result.errors.groupId as string,
        };
      });
    }
    setLoading(false);
  };

  const fetchMyGroups = async () => {
    const groups = await GroupServices.getMyGroups(user?.id as string, "");
    setMyGroups(groups);
  };

  useEffect(() => {
    fetchMyGroups();
  }, [user?.id]);

  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";
  const errorClass = "block text-sm text-red-600 mt-1 ml-1";

  return (
    <>
      <BaseModal
        title={type == "create" ? "Create New Session" : "Edit Session"}
        isOpen={true}
        onClose={() => onClose()}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="py-2">
          <div className="space-y-5">
            {/* Session Name */}
            <div>
              <label htmlFor="sessionName" className={labelClass}>
                Session Name
              </label>
              <Input
                id="sessionName"
                type="text"
                name="sessionName"
                placeholder="e.g. Weekly DSA revision"
                value={formData.sessionName}
                onChange={handleChange}
              />
              {err?.sessionName && (
                <span className={errorClass}>{err.sessionName}</span>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                name="subject"
                placeholder="e.g. Data Structures"
                value={formData.subject}
                onChange={handleChange}
              />
              {err?.subject && (
                <span className={errorClass}>{err.subject}</span>
              )}
            </div>

            {/* Group Selector */}
            <div>
              <label htmlFor="groupId" className={labelClass}>
                Group
              </label>
              <Dropdown
                id="groupId"
                value={formData.groupId}
                onChange={(groupId) =>
                  setFormData((prev) => ({ ...prev, groupId }))
                }
                options={myGroups?.map((group) => ({
                  value: group._id,
                  label: group.name,
                }))}
                placeholder="Select your group"
                searchPlaceholder="Search groups..."
                emptyMessage="No groups found"
              />
              {err?.groupId && (
                <span className={errorClass}>{err.groupId}</span>
              )}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className={labelClass}>
                Date
              </label>
              <DatePicker
                id="date"
                value={formData.date}
                onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
                min={today}
                placeholder="Select a date"
              />
              {err?.date && <span className={errorClass}>{err.date}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="startTime"
                    className="text-sm font-medium text-gray-300"
                  >
                    Start Time
                  </label>
                  {isToday && (
                    <Button
                      type="button"
                      variant="text-like"
                      onClick={handleStartNow}
                      className="text-xs hover:cursor-pointer"
                    >
                      Start now
                    </Button>
                  )}
                </div>
                <TimePicker
                  id="startTime"
                  value={formData.startTime}
                  onChange={(startTime) =>
                    setFormData((prev) => ({ ...prev, startTime }))
                  }
                  placeholder="Start time"
                />
                {err?.startTime && (
                  <span className={errorClass}>{err.startTime}</span>
                )}
              </div>

              {/* End Time */}
              <div>
                <label htmlFor="endTime" className={labelClass}>
                  End Time
                </label>
                <TimePicker
                  id="endTime"
                  value={formData.endTime}
                  onChange={(endTime) =>
                    setFormData((prev) => ({ ...prev, endTime }))
                  }
                  placeholder="End time"
                />
                {err?.endTime && (
                  <span className={errorClass}>{err.endTime}</span>
                )}
              </div>
            </div>

            {duration && (
              <p className="flex items-center gap-2 text-sm text-gray-400 -mt-1">
                <Clock size={14} className="text-[#00D2D9]" />
                Duration: <span className="text-white">{duration}</span>
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="text-like"
                onClick={() => onClose()}
                className="px-2 hover:cursor-pointer"
              >
                Cancel
              </Button>
              {loading ? (
                <InPageLoading />
              ) : (
                <Button type="submit" variant="primary" className="px-6">
                  {type == "create" ? "Create Session" : "Update Session"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </BaseModal>
    </>
  );
}

export default CreateSession;
