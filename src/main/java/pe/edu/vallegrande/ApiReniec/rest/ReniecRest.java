package pe.edu.vallegrande.ApiReniec.rest;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ApiReniec.service.ReniecService;
import pe.edu.vallegrande.ApiReniec.repository.ReniecRepository;
import pe.edu.vallegrande.ApiReniec.model.DataReniec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reniec")
@AllArgsConstructor
public class ReniecRest {

    private final ReniecService reniecService;
    private final ReniecRepository reniecRepository;

    @GetMapping("/active")
    public Flux<DataReniec> getActiveReniecData() {
        return reniecRepository.findAllByStatus("A");
    }

    @GetMapping("/inactive")
    public Flux<DataReniec> getInactiveReniecData() {
        return reniecRepository.findAllByStatus("I");
    }

    @GetMapping("/{dni}")
    public Mono<DataReniec> getReniecData(@PathVariable String dni) {
        return reniecService.fetchAndSaveReniecData(dni);
    }

    @PutMapping("/{id}")
    public Mono<DataReniec> updateReniecData(@PathVariable Long id, @RequestParam String newDni) {
        return reniecService.updateReniecData(id, newDni);
    }

    @DeleteMapping("/{id}")
    public Mono<Void> deleteReniecLogically(@PathVariable Long id) {
        return reniecService.deleteLogically(id);
    }

    @PutMapping("/restore/{id}")
    public Mono<Void> restoreReniecLogically(@PathVariable Long id) {
        return reniecService.restoreLogically(id);
    }

}