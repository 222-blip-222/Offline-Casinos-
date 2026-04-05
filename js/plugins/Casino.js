/*:
 * @plugindesc Казино: слоты и рулетка
 * @author RPG Casino
 *
 * @param tokenVarId
 * @text ID переменной жетонов
 * @default 1
 *
 * @param goldPerToken
 * @text Золото за 1 жетон
 * @default 10
 */

(function() {
  var params = PluginManager.parameters('Casino');
  var TOKEN_VAR = Number(params['tokenVarId'] || 1);
  var GOLD_RATE = Number(params['goldPerToken'] || 10);

  // ===== ОБМЕН ЗОЛОТА =====
  function buyTokens(amount) {
    var cost = amount * GOLD_RATE;
    if ($gameParty.gold() < cost) {
      $gameMessage.add("Недостаточно золота!");
      return;
    }
    $gameParty.loseGold(cost);
    $gameVariables.setValue(TOKEN_VAR,
      $gameVariables.value(TOKEN_VAR) + amount);
    $gameMessage.add("Куплено " + amount + " жетонов!");
  }

  function sellTokens(amount) {
    var cur = $gameVariables.value(TOKEN_VAR);
    if (cur < amount) {
      $gameMessage.add("Мало жетонов!");
      return;
    }
    $gameVariables.setValue(TOKEN_VAR, cur - amount);
    $gameParty.gainGold(amount * GOLD_RATE);
    $gameMessage.add("Продано " + amount + " жетонов!");
  }

  // ===== СЛОТ-МАШИНА =====
  function playSlots(bet) {
    var tokens = $gameVariables.value(TOKEN_VAR);
    if (tokens < bet) {
      $gameMessage.add("Нужно " + bet + " жетонов для ставки!");
      return;
    }
    $gameVariables.setValue(TOKEN_VAR, tokens - bet);

    var symbols = ["7", "★", "♦", "♣", "BAR"];
    var r1 = symbols[Math.floor(Math.random() * symbols.length)];
    var r2 = symbols[Math.floor(Math.random() * symbols.length)];
    var r3 = symbols[Math.floor(Math.random() * symbols.length)];

    var msg = "[ " + r1 + " | " + r2 + " | " + r3 + " ]\n";
    var win = 0;

    if (r1 === r2 && r2 === r3) {
      if (r1 === "7") win = bet * 10;
      else if (r1 === "★") win = bet * 7;
      else if (r1 === "BAR") win = bet * 5;
      else win = bet * 3;
      msg += "ДЖЕКПОТ! Выигрыш: +" + win + " жетонов!";
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      win = bet * 2;
      msg += "Две одинаковых! Выигрыш: +" + win + " жетонов!";
    } else {
      msg += "Не повезло...";
    }

    $gameVariables.setValue(TOKEN_VAR,
      $gameVariables.value(TOKEN_VAR) + win);
    $gameMessage.add(msg);
  }

  // ===== РУЛЕТКА =====
  function playRoulette(bet, choice) {
    // choice: "red","black","green","odd","even"
    var tokens = $gameVariables.value(TOKEN_VAR);
    if (tokens < bet) {
      $gameMessage.add("Нужно " + bet + " жетонов!");
      return;
    }
    $gameVariables.setValue(TOKEN_VAR, tokens - bet);

    var num = Math.floor(Math.random() * 37); // 0-36
    var reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    var isRed = reds.indexOf(num) >= 0;
    var isBlack = num > 0 && !isRed;
    var isGreen = num === 0;

    var color = isGreen ? "Зелёный(0)" : (isRed ? "Красный" : "Чёрный");
    var win = 0;

    if (choice === "green" && isGreen) win = bet * 14;
    else if (choice === "red" && isRed) win = bet * 2;
    else if (choice === "black" && isBlack) win = bet * 2;
    else if (choice === "odd" && num > 0 && num % 2 === 1) win = bet * 2;
    else if (choice === "even" && num > 0 && num % 2 === 0) win = bet * 2;

    $gameVariables.setValue(TOKEN_VAR,
      $gameVariables.value(TOKEN_VAR) + win);

    var msg = "Рулетка: " + num + " (" + color + ")\n";
    msg += win > 0 ? "Выигрыш: +" + win + " жетонов!" : "Проигрыш...";
    $gameMessage.add(msg);
  }

  // ===== PLUGIN COMMANDS =====
  var _alias = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(cmd, args) {
    _alias.call(this, cmd, args);
    switch(cmd) {
      case 'Casino_BuyTokens':
        buyTokens(Number(args[0] || 10)); break;
      case 'Casino_SellTokens':
        sellTokens(Number(args[0] || 10)); break;
      case 'Casino_Slots':
        playSlots(Number(args[0] || 1)); break;
      case 'Casino_Roulette':
        playRoulette(Number(args[0] || 1), args[1] || 'red'); break;
      case 'Casino_ShowTokens':
        $gameMessage.add("У вас жетонов: " +
          $gameVariables.value(TOKEN_VAR)); break;
    }
  };
})();
