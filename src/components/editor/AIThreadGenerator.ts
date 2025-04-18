import "./AIThreadGenerator.css";

interface AIThreadGeneratorData {
  description: string;
  tone?: string;
  generatedContent?: string;
}

interface AIThreadGeneratorConfig {
  readOnly?: boolean;
}

export default class AIThreadGenerator {
  static get toolbox() {
    return {
      title: "AI",
      icon: "✨",
    };
  }

  private api: any;
  private data: AIThreadGeneratorData;
  private readOnly: boolean;
  private wrapper: HTMLElement;
  private promptInput: HTMLTextAreaElement;
  private toneSelect: HTMLSelectElement;
  private generateButton: HTMLButtonElement;
  private contentWrapper: HTMLElement;
  private isLoading: boolean = false;

  constructor({
    data,
    api,
    config = {},
  }: {
    data: AIThreadGeneratorData;
    api: any;
    config?: AIThreadGeneratorConfig;
  }) {
    this.api = api;
    this.data = {
      description: data?.description || "",
      tone: data?.tone || "natural",
      generatedContent: data?.generatedContent || "",
    };
    this.readOnly = config.readOnly === true;

    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("ai-thread-generator");
  }

  render() {
    if (this.readOnly) {
      return this.renderReadOnly();
    } else {
      return this.renderEditable();
    }
  }

  renderReadOnly() {
    this.wrapper.innerHTML = "";

    if (this.data.generatedContent) {
      // For readOnly mode, just show the generated content
      const contentDisplay = document.createElement("div");
      contentDisplay.classList.add(
        "ai-thread-generated-content",
        "ai-thread-readonly"
      );

      // Display the generated content
      const textContent = document.createElement("div");
      textContent.classList.add("ai-thread-text");
      textContent.textContent = this.data.generatedContent;

      contentDisplay.appendChild(textContent);
      this.wrapper.appendChild(contentDisplay);
    } else if (this.data.description) {
      // If we have a description but no content, show placeholder
      const placeholderElement = document.createElement("div");
      placeholderElement.classList.add("ai-thread-readonly-placeholder");
      placeholderElement.textContent = `AI Thread: "${this.data.description}" (Tone: ${this.data.tone})`;
      this.wrapper.appendChild(placeholderElement);
    } else {
      // Fallback if no data at all
      const emptyElement = document.createElement("div");
      emptyElement.classList.add("ai-thread-readonly-empty");
      emptyElement.textContent = "AI Thread Generator (No content)";
      this.wrapper.appendChild(emptyElement);
    }

    return this.wrapper;
  }

  renderEditable() {
    this.wrapper.innerHTML = "";

    // Create the form container
    const formContainer = document.createElement("div");
    formContainer.classList.add("ai-thread-form");

    // Create description input
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Describe what you want to generate:";
    descriptionLabel.classList.add("ai-thread-label");

    this.promptInput = document.createElement("textarea");
    this.promptInput.classList.add("ai-thread-input");
    this.promptInput.placeholder =
      "Enter a description for your thread content...";
    this.promptInput.value = this.data.description;
    this.promptInput.addEventListener("input", () => {
      this.data.description = this.promptInput.value;
    });

    // Create tone selection
    const toneLabel = document.createElement("label");
    toneLabel.textContent = "Select tone (optional):";
    toneLabel.classList.add("ai-thread-label");

    this.toneSelect = document.createElement("select");
    this.toneSelect.classList.add("ai-thread-select");

    const tones = [
      { value: "informative", label: "Informative" },
      { value: "conversational", label: "Conversational" },
      { value: "formal", label: "Formal" },
      { value: "inspirational", label: "Inspirational" },
      { value: "humorous", label: "Humorous" },
      { value: "persuasive", label: "Persuasive" },
      { value: "analytical", label: "Analytical" },
      { value: "narrative", label: "Narrative" },
      { value: "educational", label: "Educational" },
      { value: "technical", label: "Technical" },
      { value: "journalistic", label: "Journalistic" },
      { value: "review", label: "Review" },
      { value: "tutorials", label: "Tutorials" },
      { value: "marketing", label: "Marketing" },
      { value: "news", label: "News" },
      { value: "empathetic", label: "Empathetic" },
      { value: "optimistic", label: "Optimistic" },
      { value: "reflective", label: "Reflective" },
      { value: "sarcastic", label: "Sarcastic" },
      { value: "urgent", label: "Urgent" },
    ];

    tones.forEach((tone) => {
      const option = document.createElement("option");
      option.value = tone.value;
      option.textContent = tone.label;
      if (tone.value === this.data.tone) {
        option.selected = true;
      }
      this.toneSelect.appendChild(option);
    });

    this.toneSelect.addEventListener("change", () => {
      this.data.tone = this.toneSelect.value;
    });

    // Create generate button
    this.generateButton = document.createElement("button");
    this.generateButton.textContent = "Generate Content";
    this.generateButton.classList.add("ai-thread-button");
    this.generateButton.type = "button"; // Explicitly set button type
    this.generateButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent any default form behavior
      event.stopPropagation(); // Stop event propagation
      this.handleGenerate();
    });

    // Add form elements to container
    formContainer.appendChild(descriptionLabel);
    formContainer.appendChild(this.promptInput);
    formContainer.appendChild(toneLabel);
    formContainer.appendChild(this.toneSelect);
    formContainer.appendChild(this.generateButton);

    // Create content wrapper for displaying results
    this.contentWrapper = document.createElement("div");
    this.contentWrapper.classList.add("ai-thread-content-wrapper");

    // Add everything to the main wrapper
    this.wrapper.appendChild(formContainer);
    this.wrapper.appendChild(this.contentWrapper);

    // If we have saved content, display it
    if (this.data.generatedContent) {
      this.displayGeneratedContent(this.data.generatedContent);
    }

    return this.wrapper;
  }

  async handleGenerate() {
    // Validate prompt
    if (!this.promptInput.value.trim()) {
      this.showError("Please enter a description for your thread content.");
      return;
    }

    this.setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/gemini/generate/thread-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: this.data.description,
            tone: this.data.tone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get raw text from response
      const generatedContent = await response.text();

      // Store and display the generated content
      this.data.generatedContent = generatedContent;
      this.displayGeneratedContent(generatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
      this.showError("Failed to generate content. Please try again.");
    } finally {
      this.setLoading(false);
    }
  }

  displayGeneratedContent(content: string) {
    this.contentWrapper.innerHTML = "";

    const contentDisplay = document.createElement("div");
    contentDisplay.classList.add("ai-thread-generated-content");

    // Display the generated content
    const textContent = document.createElement("div");
    textContent.classList.add("ai-thread-text");
    textContent.textContent = content;

    // Create action buttons
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("ai-thread-actions");

    const insertButton = document.createElement("button");
    insertButton.textContent = "Insert";
    insertButton.type = "button"; // Explicitly set button type
    insertButton.classList.add("ai-thread-button", "ai-thread-insert");
    insertButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default button behavior
      event.stopPropagation(); // Stop event propagation
      this.insertContent(content);
    });

    const regenerateButton = document.createElement("button");
    regenerateButton.textContent = "Regenerate";
    regenerateButton.type = "button"; // Explicitly set button type
    regenerateButton.classList.add("ai-thread-button", "ai-thread-regenerate");
    regenerateButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default button behavior
      event.stopPropagation(); // Stop event propagation
      this.handleGenerate();
    });

    actionButtons.appendChild(insertButton);
    actionButtons.appendChild(regenerateButton);

    contentDisplay.appendChild(textContent);
    contentDisplay.appendChild(actionButtons);

    this.contentWrapper.appendChild(contentDisplay);
  }

  /**
   * Parse markdown text into Editor.js blocks
   */
  parseMarkdownToBlocks(markdown: string) {
    const blocks = [];

    // Split the markdown by double newlines to separate paragraphs
    const paragraphs = markdown.split(/\n\n+/);

    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) continue;

      // Check for headers (# Header)
      const headerMatch = trimmedParagraph.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        blocks.push({
          type: "header",
          data: {
            text: headerMatch[2].trim(),
            level: headerMatch[1].length,
          },
        });
        continue;
      }

      // Check for unordered lists
      if (trimmedParagraph.match(/^[-*]\s+.+(\n[-*]\s+.+)*$/)) {
        const items = trimmedParagraph
          .split("\n")
          .map((item) => item.replace(/^[-*]\s+/, "").trim())
          .filter((item) => item.length > 0);

        blocks.push({
          type: "list",
          data: {
            style: "unordered",
            items: items,
          },
        });
        continue;
      }

      // Check for ordered lists
      if (trimmedParagraph.match(/^\d+\.\s+.+(\n\d+\.\s+.+)*$/)) {
        const items = trimmedParagraph
          .split("\n")
          .map((item) => item.replace(/^\d+\.\s+/, "").trim())
          .filter((item) => item.length > 0);

        blocks.push({
          type: "list",
          data: {
            style: "ordered",
            items: items,
          },
        });
        continue;
      }

      // Check for blockquotes
      if (trimmedParagraph.startsWith(">")) {
        const lines = trimmedParagraph.split("\n");
        const quoteText = lines
          .map((line) => line.replace(/^>\s?/, "").trim())
          .join(" ");

        blocks.push({
          type: "quote",
          data: {
            text: quoteText,
            caption: "",
          },
        });
        continue;
      }

      // Check for code blocks
      const codeBlockMatch = trimmedParagraph.match(
        /^```([a-z]*)\n([\s\S]*)\n```$/
      );
      if (codeBlockMatch) {
        blocks.push({
          type: "code",
          data: {
            code: codeBlockMatch[2].trim(),
            language: codeBlockMatch[1] || "plaintext",
          },
        });
        continue;
      }

      // Default to paragraph for everything else
      // Process inline markdown like bold, italic, etc.
      let processedText = trimmedParagraph
        // Bold
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/__(.*?)__/g, "<b>$1</b>")
        // Italic
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/_(.*?)_/g, "<i>$1</i>")
        // Inline code
        .replace(/`(.*?)`/g, "<code>$1</code>")
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

      blocks.push({
        type: "paragraph",
        data: {
          text: processedText,
        },
      });
    }

    return blocks;
  }

  // async insertContent(content: string) {
  //   try {
  //     // Parse markdown content into Editor.js blocks
  //     const blocks = this.parseMarkdownToBlocks(content);

  //     // Get the current block index
  //     const currentIndex = this.api.blocks.getCurrentBlockIndex();

  //     // Insert each block after the current one, in reverse order to maintain sequence
  //     for (let i = blocks.length - 1; i >= 0; i--) {
  //       const block = blocks[i];
  //       await this.api.blocks.insert(
  //         block.type,
  //         block.data,
  //         {},
  //         currentIndex + 1
  //       );
  //     }

  //     this.showSuccess("Content inserted successfully");
  //   } catch (error) {
  //     console.error("Error inserting content:", error);
  //     this.showError("Failed to insert content. Please try again.");
  //   }
  // }

  async insertContent(content: string) {
    try {
      // Parse markdown content into Editor.js blocks
      const blocks = this.parseMarkdownToBlocks(content);

      // Get the current block index
      const currentIndex = this.api.blocks.getCurrentBlockIndex();

      // Insert each block after the current one, in reverse order to maintain sequence
      for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        await this.api.blocks.insert(
          block.type,
          block.data,
          {},
          currentIndex + 1
        );
      }

      // Remove this AI Thread Generator block after content is inserted
      this.api.blocks.delete(currentIndex);

      // Optional: You could show a brief success message
      // this.showSuccess("Content inserted successfully");
    } catch (error) {
      console.error("Error inserting content:", error);
      this.showError("Failed to insert content. Please try again.");
    }
  }

  showSuccess(message: string) {
    // You could use the api.notifier here if available
    console.log(message);
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
    this.generateButton.disabled = isLoading;

    if (isLoading) {
      this.generateButton.textContent = "Generating...";

      // Clear previous content and show loading shimmer
      this.contentWrapper.innerHTML = "";
      const shimmer = document.createElement("div");
      shimmer.classList.add("ai-thread-shimmer");

      // Add multiple shimmer lines to simulate paragraph loading
      for (let i = 0; i < 5; i++) {
        const shimmerLine = document.createElement("div");
        shimmerLine.classList.add("ai-thread-shimmer-line");
        shimmer.appendChild(shimmerLine);
      }

      this.contentWrapper.appendChild(shimmer);
    } else {
      this.generateButton.textContent = "Generate Content";
    }
  }

  showError(message: string) {
    const errorElement = document.createElement("div");
    errorElement.classList.add("ai-thread-error");
    errorElement.textContent = message;

    // Remove any existing error
    const existingError = this.wrapper.querySelector(".ai-thread-error");
    if (existingError) {
      existingError.remove();
    }

    // Insert error after the form
    const formElement = this.wrapper.querySelector(".ai-thread-form");
    if (formElement) {
      formElement.appendChild(errorElement);
    }

    // Auto-remove after 3 seconds
    setTimeout(() => {
      errorElement.remove();
    }, 3000);
  }

  save() {
    return {
      description: this.data.description,
      tone: this.data.tone,
      generatedContent: this.data.generatedContent,
    };
  }
}
