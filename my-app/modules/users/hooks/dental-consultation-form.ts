import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"

// Define thread type
export interface Thread {
  id: string
  title: string
  patientName: string
  date: string
  type: string
  messages: Message[]
  icon: "folder" | "tooth"
}

// Define message type
export interface Message {
  id: number
  content: string
  sender: "user" | "assistant" | "system"
  timestamp: string
  image?: string | null
  hasImage?: boolean
}

// Sample initial threads data
const initialThreads: Thread[] = [
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
]

export interface NewCaseForm {
  title: string
  patientName: string
  date: string
  type: string
}

export function useDentalConsultation() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads)
  const [activeThreadId, setActiveThreadId] = useState("thread-2")
  const [inputValue, setInputValue] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false)
  const scanFileInputRef = useRef<HTMLInputElement>(null)

  // New case form state
  const [newCase, setNewCase] = useState<NewCaseForm>({
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

  const updateNewCaseField = (field: keyof NewCaseForm, value: string) => {
    setNewCase({ ...newCase, [field]: value })
  }

  return {
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
  }
}