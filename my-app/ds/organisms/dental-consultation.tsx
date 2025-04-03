"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/ds/atoms/button"
import { Input } from "@/ds/atoms/input"
import {
  Settings,
  ArrowRight,
  Upload,
  ImageIcon,
  X,
  PlusCircle,
  Menu,
  MessageSquare,
  FileText,
  Folder,
  SmileIcon as Tooth,
  Calendar,
  User,
} from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { cn } from "@/_core/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ds/atoms/dialog"
import { Label } from "@/ds/atoms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ds/atoms/select"
import { format } from "date-fns"

// Define thread type
interface Thread {
  id: string
  title: string
  patientName: string
  date: string
  type: string
  messages: Message[]
  icon: "folder" | "tooth"
}

// Define message type
interface Message {
  id: number
  content: string
  sender: "user" | "assistant" | "system"
  timestamp: string
  image?: string | null
  hasImage?: boolean
}

export default function DentalConsultation() {
  // Sample threads data
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "thread-1",
      title: "Case 1",
      patientName: "John Smith",
      date: "2025-03-28",
      type: "Implant Consultation",
      icon: "folder",
      messages: [
        {
          id: 1,
          content: "Initial consultation for dental implants",
          sender: "user",
          timestamp: "9:30 AM",
        },
        {
          id: 2,
          content: "Patient has good bone density in the lower jaw",
          sender: "assistant",
          timestamp: "9:32 AM",
        },
      ],
    },
    {
      id: "thread-2",
      title: "Case 2",
      patientName: "Sarah Johnson",
      date: "2025-04-01",
      type: "Low Bone Density",
      icon: "folder",
      messages: [
        {
          id: 1,
          content: "What are the latest dental implant options for patients who have issues with low bone density",
          sender: "user",
          timestamp: "10:24 AM",
        },
        {
          id: 2,
          content: "New research shows that implants made out of ....",
          sender: "assistant",
          timestamp: "10:25 AM",
        },
        {
          id: 3,
          content: "Scan Uploaded",
          sender: "system",
          hasImage: true,
          timestamp: "10:26 AM",
        },
        {
          id: 4,
          content: "What are the potential risks or challenges on using that kind of implant on the number 14 tooth",
          sender: "user",
          timestamp: "10:28 AM",
        },
      ],
    },
    {
      id: "thread-3",
      title: "Latest Implants",
      patientName: "Research",
      date: "2025-03-15",
      type: "Research",
      icon: "tooth",
      messages: [
        {
          id: 1,
          content: "What are the latest advancements in dental implant materials?",
          sender: "user",
          timestamp: "2:15 PM",
        },
        {
          id: 2,
          content:
            "Recent advancements include zirconia implants, which offer better biocompatibility and aesthetic results compared to traditional titanium implants.",
          sender: "assistant",
          timestamp: "2:16 PM",
        },
      ],
    },
  ])

  const [activeThreadId, setActiveThreadId] = useState("thread-2")
  const [inputValue, setInputValue] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false)
  const scanFileInputRef = useRef<HTMLInputElement>(null)

  // New case form state
  const [newCase, setNewCase] = useState({
    title: "",
    patientName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    type: "Consultation",
  })

  // Get active thread
  const activeThread = threads.find((thread) => thread.id === activeThreadId) || threads[0]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [activeThread?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (inputValue.trim() || selectedImage) {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const newMessage = {
        id: activeThread.messages.length + 1,
        content: inputValue,
        sender: "user" as const,
        image: imagePreview,
        timestamp: timeString,
      }

      // Update the messages in the active thread
      const updatedThreads = threads.map((thread) => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            messages: [...thread.messages, newMessage],
          }
        }
        return thread
      })

      setThreads(updatedThreads)
      setInputValue("")
      setSelectedImage(null)
      setImagePreview(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddNewCase = () => {
    const newId = `thread-${threads.length + 1}`
    const newThreadCase: Thread = {
      id: newId,
      title: newCase.title,
      patientName: newCase.patientName,
      date: newCase.date,
      type: newCase.type,
      icon: "folder",
      messages: [],
    }

    setThreads([...threads, newThreadCase])
    setActiveThreadId(newId)
    setIsAddCaseOpen(false)

    // Reset form
    setNewCase({
      title: "",
      patientName: "",
      date: format(new Date(), "yyyy-MM-dd"),
      type: "Consultation",
    })
  }

  const handleScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const now = new Date()
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        // Create a system message with the scan
        const newMessage = {
          id: activeThread.messages.length + 1,
          content: "Scan Uploaded",
          sender: "system" as const,
          timestamp: timeString,
          image: reader.result as string,
        }

        // Update the messages in the active thread
        const updatedThreads = threads.map((thread) => {
          if (thread.id === activeThreadId) {
            return {
              ...thread,
              messages: [...thread.messages, newMessage],
            }
          }
          return thread
        })

        setThreads(updatedThreads)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScanClick = () => {
    scanFileInputRef.current?.click()
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <div className="w-[280px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-sky-500 to-indigo-500 text-white">DR</AvatarFallback>
            </Avatar>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Dr. Roberts</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-3 py-4 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">THREADS</h3>
            <Dialog open={isAddCaseOpen} onOpenChange={setIsAddCaseOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Case</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new case. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="case-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="case-title"
                      value={newCase.title}
                      onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                      className="col-span-3"
                      placeholder="Case title"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-name" className="text-right">
                      Patient
                    </Label>
                    <Input
                      id="patient-name"
                      value={newCase.patientName}
                      onChange={(e) => setNewCase({ ...newCase, patientName: e.target.value })}
                      className="col-span-3"
                      placeholder="Patient name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="case-date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="case-date"
                      type="date"
                      value={newCase.date}
                      onChange={(e) => setNewCase({ ...newCase, date: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="case-type" className="text-right">
                      Type
                    </Label>
                    <Select value={newCase.type} onValueChange={(value) => setNewCase({ ...newCase, type: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select case type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Implant">Implant</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCaseOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNewCase}>Save Case</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1 mb-6">
            {threads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                active={activeThreadId === thread.id}
                onClick={() => setActiveThreadId(thread.id)}
              />
            ))}
          </div>

          <div className="px-2 mb-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm h-9 px-3"
              onClick={() => setIsAddCaseOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Thread
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
        {/* Header */}
        <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-between bg-white dark:bg-zinc-950 shadow-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="font-medium text-zinc-900 dark:text-zinc-100">{activeThread.title}</h2>
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 ml-2">
              <User className="h-3 w-3" />
              <span>{activeThread.patientName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <Calendar className="h-3 w-3" />
              <span>{new Date(activeThread.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Patient Records
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900">
          {activeThread.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col gap-4 text-zinc-500 dark:text-zinc-400">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <MessageSquare className="h-8 w-8" />
              </div>
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            activeThread.messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                {message.sender === "system" ? (
                  <div className="flex items-center gap-2 py-2 mx-auto bg-zinc-100 dark:bg-zinc-800/50 px-3 rounded-full text-sm text-zinc-600 dark:text-zinc-300">
                    <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                      <Tooth className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <span>{message.content}</span>
                  </div>
                ) : (
                  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-1`}>
                    <div
                      className={cn(
                        "max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm",
                        message.sender === "user"
                          ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white"
                          : "bg-gradient-to-br from-amber-200 to-amber-300 text-zinc-800",
                      )}
                    >
                      {message.content}
                      {message.image && (
                        <div className="mt-2">
                          <Image
                            src={message.image || "/placeholder.svg"}
                            alt="Uploaded image"
                            width={200}
                            height={150}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <div
                        className={cn("text-xs mt-1.5", message.sender === "user" ? "text-sky-100" : "text-amber-700")}
                      >
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
          {imagePreview && (
            <div className="relative inline-block mb-3">
              <div className="relative w-24 h-24 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-700">
                <Image src={imagePreview || "/placeholder.svg"} alt="Selected image" fill className="object-cover" />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md"
                onClick={removeSelectedImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="relative mb-3">
            <Input
              placeholder="Type here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-24 py-6 rounded-full border-zinc-300 dark:border-zinc-700 shadow-sm focus-visible:ring-sky-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                onClick={handleImageClick}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <Button
                size="icon"
                className="rounded-full h-9 w-9 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !selectedImage}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              className="rounded-full text-sm border-zinc-300 dark:border-zinc-700 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Case
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-sm border-zinc-300 dark:border-zinc-700 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={handleScanClick}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Scans
            </Button>
            <input type="file" ref={scanFileInputRef} onChange={handleScanUpload} accept="image/*" className="hidden" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ThreadItemProps {
  thread: Thread
  active: boolean
  onClick: () => void
}

function ThreadItem({ thread, active, onClick }: ThreadItemProps) {
  return (
    <button
      className={cn(
        "flex items-start gap-2 w-full px-2 py-2 text-sm rounded-lg transition-colors",
        active
          ? "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/50",
      )}
      onClick={onClick}
    >
      {thread.icon === "folder" ? (
        <Folder className="h-4 w-4 mt-0.5 flex-shrink-0" />
      ) : (
        <Tooth className="h-4 w-4 mt-0.5 flex-shrink-0" />
      )}
      <div className="text-left flex-1 overflow-hidden">
        <div className="font-medium truncate">{thread.title}</div>
        <div
          className={cn(
            "text-xs truncate",
            active ? "text-sky-600 dark:text-sky-300" : "text-zinc-500 dark:text-zinc-400",
          )}
        >
          {thread.patientName} • {new Date(thread.date).toLocaleDateString()}
        </div>
      </div>
    </button>
  )
}

