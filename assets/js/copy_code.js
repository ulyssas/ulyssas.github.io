// Adapted from Minimal Mistakes

$(document).ready(function () {
  // Add copy button for <pre> blocks
  var copyText = function (text) {
    if (window.isSecureContext && navigator.clipboard) {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => false
      );
    } else {
      var textarea = document.createElement("textarea");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      textarea.setAttribute("readonly", "");
      textarea.value = text;
      document.body.appendChild(textarea);
      var success = true;
      try {
        textarea.select();
        success = document.execCommand("copy");
      } catch (e) {
        success = false;
      }
      document.body.removeChild(textarea);
      return Promise.resolve(success);
    }
  };

  var copyButtonEventListener = function (event) {
    var thisButton = event.currentTarget;
    var container = thisButton.closest(".code-block-container");
    var codeBlock = container.querySelector("code");

    if (!codeBlock) return;

    // Skip line numbers if present (i.e. {% highlight lineno %})
    var realCodeBlock = codeBlock.querySelector("td.code, td.rouge-code");
    var targetText = realCodeBlock ? realCodeBlock.innerText : codeBlock.innerText;

    copyText(targetText.trim()).then(function (success) {
      if (success) {
        thisButton.classList.add('copied');
        setTimeout(function () {
          thisButton.classList.remove('copied');
          thisButton.blur();
        }, 1500);
      }
    });
  };

  var codeBlocks = document.querySelectorAll(
    "div.highlighter-rouge pre, pre.highlight, pre"
  );

  codeBlocks.forEach(function (pre) {
    if (pre.parentElement.classList.contains("code-block-container")) return;

    var container = document.createElement("div");
    container.className = "code-block-container";
    pre.parentNode.insertBefore(container, pre);
    container.appendChild(pre);

    var copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.title = "Copy to clipboard";
    copyButton.className = "clipboard-copy-button";
    copyButton.innerHTML = '<span class="sr-only">Copy code</span><i class="far fa-fw fa-copy"></i><i class="fas fa-fw fa-check copied"></i>';
    copyButton.addEventListener("click", copyButtonEventListener);
    container.appendChild(copyButton);
  });
});