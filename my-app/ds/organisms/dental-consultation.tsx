"use client"

import type React from "react"
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
import { useDentalConsultation, Thread, Message } from "@/modules/users/hooks/dental-consultation-form"

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

export default function DentalConsultation() {
  const {
    threads,
    activeThreadId,
    activeThread,
    inputValue,
    selectedImage,
    imagePreview,
    messagesEndRef,
    fileInputRef,
    isAddCaseOpen,
    scanFileInputRef,
    newCase,
    
    // Actions
    setActiveThreadId,
    setInputValue,
    setIsAddCaseOpen,
    handleSendMessage,
    handleKeyDown,
    handleImageClick,
    handleImageChange,
    removeSelectedImage,
    handleAddNewCase,
    handleScanUpload,
    handleScanClick,
    updateNewCaseField
  } = useDentalConsultation()

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
                      onChange={(e) => updateNewCaseField("title", e.target.value)}
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
                      onChange={(e) => updateNewCaseField("patientName", e.target.value)}
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
                      onChange={(e) => updateNewCaseField("date", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="case-type" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={newCase.type} 
                      onValueChange={(value: string) => updateNewCaseField("type", value)}
                    >
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
            activeThread.messages.map((message: Message) => (
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